import {
  BadRequestError,
  GeneralError,
  LimitError,
  MiddleWare,
  NotFound,
  NotImplement,
  Req,
  store,
} from '@nodeeweb/core';
import {
  IOrder,
  OrderDocument,
  OrderModel,
  OrderStatus,
  TransactionProvider,
} from '../../schema/order.schema';
import { ProductDocument, ProductModel } from '../../schema/product.schema';
import { MAXIMUM_NEED_TO_PAY_TRANSACTION } from '../../constants/limit';
import { FilterQuery, Types } from 'mongoose';
import { DiscountDocument, DiscountModel } from '../../schema/discount.schema';
import { roundPrice } from '../../utils/helpers';
import { INACTIVE_PRODUCT_TIME } from '../../constants/limit';
import utils from './utils.service';
import { PaymentVerifyStatus, ShopCallbackStatus } from '../../types/order';
import {
  BankGatewayPluginContent,
  BankGatewayVerifyArgs,
  PostGatewayPluginContent,
  ShopPluginType,
} from '../../types/plugin';
import discountService from '../discount/service';
import logger from '../../utils/log';
import { axiosError2String } from '@nodeeweb/core/utils/helpers';

class TransactionService {
  transactionSupervisors = new Map<string, NodeJS.Timer>();

  get orderModel() {
    return store.db.model('order') as OrderModel;
  }
  get productModel() {
    return store.db.model('product') as ProductModel;
  }
  get discountModel() {
    return store.db.model('discount') as DiscountModel;
  }

  private async getNeedToPayOrder(
    filter: FilterQuery<IOrder>,
    throwOnError = true
  ) {
    const order = await this.orderModel.findOne({
      ...filter,
      active: true,
      status: OrderStatus.NeedToPay,
    });
    if (!order && throwOnError) throw new NotFound('order not found');
    return order;
  }

  createTransaction: MiddleWare = async (req, res) => {
    // 1. check user maximum need paid transaction
    const needToPayOrders = await this.orderModel
      .find({
        'customer._id': req.user._id,
        status: OrderStatus.NeedToPay,
        active: true,
      })
      .count();

    if (needToPayOrders > MAXIMUM_NEED_TO_PAY_TRANSACTION)
      throw new LimitError(
        'Maximum need to pay transaction , please paid them first'
      );

    // 2. find order
    const order = await this.orderModel.findOne({
      'customer._id': req.user._id,
      status: OrderStatus.Cart,
      'products.0': { $exists: true },
      active: true,
    });
    if (!order) throw new NotFound('order not found');

    // 3. check product details
    const products = await this.productModel.find({
      _id: { $in: order.products.map((p) => p._id) },
      active: true,
    });
    this.productCheck(order, products);

    // 4. discount
    let discount: DiscountDocument;
    if (req.body.discount) {
      discount = await discountService.consumeDiscount(req);
    }

    // 5. pricing and verify post
    const {
      postPrice,
      taxesPrice,
      totalPrice,
      discount: discountPrice,
    } = await this.calculatePrice(order, {
      discount,
      post: req.body.post,
      tax: true,
      total: true,
    });

    // 6. create payment link
    const transaction = await this.createPaymentLink(
      order._id,
      totalPrice,
      products,
      req.user.phone
    );

    // 7. post if not payment issue
    let post: IOrder['post'] = {};
    if (!totalPrice) {
      post = await this.submitPostReq(order);
    }

    // 8. update order
    const newOrder = await this.orderModel.findOneAndUpdate(
      {
        _id: order._id,
        status: OrderStatus.Cart,
        active: true,
      },
      {
        $set: {
          address: req.body.address,
          discount: {
            code: req.body.discount,
            amount: discountPrice,
          },
          post: req.body.post
            ? { ...req.body.post, ...post, price: postPrice }
            : post,
          status: totalPrice ? OrderStatus.NeedToPay : OrderStatus.Posting,
          tax: taxesPrice,
          totalPrice,
          transaction,
        },
      },
      { new: true }
    );

    // 9. active supervisor
    await this.transactionSupervisor(newOrder, {
      clear: true,
      expired_watcher: totalPrice ? true : false,
      notif_watcher: totalPrice ? true : false,
    });

    // 10. send sms if payment completed by discount
    if (!totalPrice) {
      // send change state sms
      utils.sendOnStateChange(newOrder)?.then();
    }

    return res.status(201).json({ data: newOrder });
  };

  getPrice: MiddleWare = async (req, res) => {
    const order = await this.orderModel.findOne({
      'customer._id': req.user._id,
      status: OrderStatus.Cart,
      active: true,
    });

    const extraOpt: any = {};
    if (req.query.discount)
      extraOpt.discount = await discountService.getOne(req);

    if (req.query.post) {
      extraOpt.post = JSON.parse(req.query.post as string);
    }

    return res.json({
      data: await this.calculatePrice(order, { ...req.query, ...extraOpt }),
    });
  };

  paymentCallback: MiddleWare = async (req, res) => {
    // handle payment
    const order = await this.orderModel.findOne({
      _id: req.params.orderId,
      active: true,
    });

    const { status } = await this.handlePayment(order, true, true, req.query);

    let msg: string;
    switch (status) {
      case PaymentVerifyStatus.Paid:
        msg = 'paid';
        break;
      case PaymentVerifyStatus.CheckBefore:
        msg = 'verify before';
        break;
      case PaymentVerifyStatus.Failed:
        msg = 'failed';
        break;
    }
    return res.send(msg);
  };

  private productCheck(order: OrderDocument, products: ProductDocument[]) {
    let activeCheck: Types.ObjectId[] = [],
      priceCheck: Types.ObjectId[] = [],
      quantityCheck: Types.ObjectId[] = [];

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));
    // active
    if (products.length !== order.products.length) {
      const unAvailableIds = order.products
        .filter((p) => !productMap.has(p._id.toString()))
        .map((p) => p._id);
      activeCheck.push(...unAvailableIds);
    }

    // price , quantity
    order.products.forEach((p) => {
      const mp = productMap.get(p._id.toString());
      if (!mp) return;
      if (mp.salePrice !== p.salePrice) priceCheck.push(p._id);
      if (mp.quantity - p.quantity < 0) quantityCheck.push(p._id);
    });

    const errors = [activeCheck, priceCheck, quantityCheck].flat();
    if (errors.length)
      throw new BadRequestError(
        `these products must be change\n${[
          ...new Set(errors.map((id) => id.toString())),
        ].join(',')}`
      );
  }

  private async getPostPrice(
    products: ProductDocument[],
    address: Omit<IOrder['address'], 'receiver'>
  ) {
    const postPlugin = store.plugins.get(
      ShopPluginType.POST_GATEWAY
    ) as PostGatewayPluginContent;
    if (!postPlugin) return 0;

    return (await postPlugin.stack[1]({ products, address })).price;
  }

  private submitPostReq(order: OrderDocument): Promise<IOrder['post']> {
    const postPlugin = store.plugins.get(
      ShopPluginType.POST_GATEWAY
    ) as PostGatewayPluginContent;
    if (!postPlugin) return;

    return postPlugin.stack[0]({
      address: order.address,
      products: order.products,
    });
  }

  private async calculatePrice(
    order: OrderDocument,
    opt: {
      post?: {
        provider?: string;
        address: Omit<IOrder['address'], 'receiver'>;
      };
      tax?: boolean;
      discount?: DiscountDocument;
      products?: boolean;
      total?: boolean;
    }
  ) {
    let postPrice: number,
      productsPrice: number,
      taxesPrice: number,
      discount: number,
      totalPrice_before_taxes: number,
      totalPrice_before_discount: number,
      totalPrice: number;

    const products = order?.products ?? [];

    const _post = async () =>
      postPrice !== undefined
        ? postPrice
        : opt.post
        ? roundPrice(
            await this.getPostPrice(products as any, opt.post?.address)
          )
        : 0;
    const _products = () =>
      productsPrice
        ? productsPrice
        : roundPrice(
            products.reduce((acc, { salePrice }) => acc + salePrice, 0)
          );
    const _total_before_tax = async () => {
      if (totalPrice_before_taxes !== undefined) return totalPrice_before_taxes;
      let p = postPrice,
        pp = productsPrice;
      if (!p) p = await _post();
      if (!pp) pp = _products();
      return roundPrice(p + pp);
    };
    const _taxes = async () => {
      if (taxesPrice) return taxesPrice;
      return roundPrice(store.settings.taxRate * (await _total_before_tax()));
    };
    const _total_before_discount = async () => {
      return totalPrice_before_discount
        ? totalPrice_before_discount
        : roundPrice((await _taxes()) + (await _total_before_tax()));
    };
    const _discount = async () => {
      if (discount !== undefined) return discount;
      let result = 0;
      if (opt.discount?.amount) result = opt.discount.amount;
      else if (opt.discount?.percentage)
        result = Math.min(
          opt.discount.maxAmount,
          (await _total_before_discount()) * opt.discount.percentage
        );
      return roundPrice(result);
    };
    const _total = async () => {
      const tp = totalPrice
        ? totalPrice
        : roundPrice((await _total_before_discount()) - (await _discount()));
      if (tp === 0) return tp;
      if (tp < 1000) return 1000;
      return tp;
    };

    postPrice = opt.post ? await _post() : undefined;
    productsPrice = opt.products ? _products() : undefined;
    totalPrice_before_taxes = opt.total ? await _total_before_tax() : undefined;
    discount = opt.discount ? await _discount() : undefined;
    taxesPrice = opt.tax ? await _taxes() : undefined;
    totalPrice_before_discount = opt.total
      ? await _total_before_discount()
      : undefined;
    totalPrice = opt.total ? await _total() : undefined;

    return {
      postPrice,
      productsPrice,
      totalPrice_before_taxes,
      taxesPrice,
      totalPrice_before_discount,
      discount,
      totalPrice,
    };
  }

  private async createPaymentLink(
    orderId: string,
    amount: number,
    products: ProductDocument[],
    userPhone: string
  ): Promise<Partial<OrderDocument['transaction']>> {
    const bankPlugin = store.plugins.get(
      ShopPluginType.BANK_GATEWAY
    ) as BankGatewayPluginContent;

    if (!bankPlugin)
      return {
        authority: new Date().toISOString(),
        provider: TransactionProvider.Manual,
      };

    // env
    // if (envAllowed([Environment.Local])) {
    //   return ['https://example.com', '' + Date.now()];
    // }

    const description = `برای خرید محصولات ${products
      .map(({ title }) => title.fa ?? title.en ?? Object.values(title)[0])
      .join(' ، ')} از فروشگاه ${store.env.APP_NAME}`;

    return await bankPlugin.stack[0]({
      amount,
      callback_url: `${store.env.BASE_URL}/api/v1/order/payment_callback/${orderId}?amount=${amount}`,
      currency: 'IRT',
      description,
      userPhone,
    });
  }

  async handlePayment(
    order: OrderDocument,
    successAction: boolean,
    failedAction: boolean,
    extraFields?: any
  ) {
    const _clearTimer = (authority: string) => {
      const expiredTimer = this.transactionSupervisors.get(authority + '-1');
      const notifTimer = this.transactionSupervisors.get(authority + '-2');

      [expiredTimer, notifTimer]
        .filter((t) => t)
        .forEach((timer, index) => {
          clearTimeout(timer);
          this.transactionSupervisors.delete(`${authority}-${index + 1}`);
        });
    };

    const _success = async () => {
      const update = {
        $set: {
          status: OrderStatus.Posting,
          post: {
            ...order.toObject().post,
            ...(await this.submitPostReq(order)),
          },
        },
        $unset: { 'transaction.expiredAt': '' },
      };
      console.log('call', update);
      order = await this.orderModel.findOneAndUpdate(
        { _id: order._id },
        update,
        { new: true }
      );

      // send sms
      utils.sendOnStateChange(order)?.then();
    };

    const _failed = async () => {
      // rollback
      // disabled order
      order = await this.orderModel.findOneAndUpdate(
        { _id: order._id },
        {
          $set: { active: false, status: OrderStatus.Canceled },
        },
        { new: true }
      );

      // rollback products
      await this.productModel.bulkWrite(
        order.products.map((p) => ({
          updateOne: {
            filter: { _id: p._id },
            update: { $inc: { quantity: p.quantity } },
          },
        })),
        { ordered: false }
      );

      // pull discount consumer
      if (order.discount) {
        await this.discountModel.updateOne(
          { code: order.discount.code },
          { $pull: { consumers: order.customer._id }, $inc: { usageLimit: 1 } }
        );
      }
    };

    const _core = async () => {
      if ([OrderStatus.Posting, OrderStatus.Completed].includes(order.status))
        return { status: PaymentVerifyStatus.CheckBefore, order };
      else if (
        [OrderStatus.Cart, OrderStatus.Canceled, OrderStatus.Expired].includes(
          order.status
        )
      )
        return { status: PaymentVerifyStatus.Failed, order };

      if (order.status !== OrderStatus.NeedToPay)
        throw new BadRequestError(
          `order status invalid, current status: ${order.status}`
        );

      const { status } = await this.verifyPayment({
        ...extraFields,
        authority: order.transaction.authority,
        amount: order.totalPrice,
      });

      switch (status) {
        case PaymentVerifyStatus.Failed:
          if (failedAction) await _failed();
          break;
        case PaymentVerifyStatus.CheckBefore:
          break;
        case PaymentVerifyStatus.Paid:
          if (successAction) await _success();
          break;
      }

      return { status, order };
    };

    // clear timer
    _clearTimer(order.transaction.authority);

    // core
    return await _core();
  }

  private async transactionSupervisor(
    order: OrderDocument,
    {
      clear,
      expired_watcher,
      notif_watcher,
      watchers_timeout = INACTIVE_PRODUCT_TIME,
    }: {
      clear?: boolean;
      expired_watcher?: boolean;
      notif_watcher?: boolean;
      watchers_timeout?: number;
    }
  ) {
    console.log(watchers_timeout);
    // clear
    if (clear) {
      // inactive products
      await this.productModel.bulkWrite(
        order.products.map((p) => ({
          updateOne: {
            filter: { _id: p._id },
            update: {
              $inc: {
                quantity: -p.quantity,
              },
            },
          },
        })),
        { ordered: false }
      );
    }

    // watchers
    if (expired_watcher && watchers_timeout !== -1) {
      // create watcher
      // 1. Expire
      const expiredTimer = setTimeout(async () => {
        try {
          this.transactionSupervisors.delete(
            order.transaction.authority + '-1'
          );
          const td = await this.orderModel.findOne({
            _id: order._id,
            status: OrderStatus.NeedToPay,
          });
          if (!td) return;
          await this.handlePayment(td, true, true);
        } catch (err) {}
      }, watchers_timeout);
      this.transactionSupervisors.set(
        order.transaction.authority + '-1',
        expiredTimer
      );
    }

    if (notif_watcher && watchers_timeout !== -1) {
      //2. Notification Before Expired
      const notifTimer = setTimeout(async () => {
        try {
          this.transactionSupervisors.delete(
            order.transaction.authority + '-2'
          );
          const td = await this.orderModel.findOne({
            _id: order._id,
            status: OrderStatus.NeedToPay,
            active: true,
          });
          if (!td) return;
          utils.sendOnExpire(order)?.then();
        } catch (err) {}
      }, watchers_timeout * 0.6);
      this.transactionSupervisors.set(
        order.transaction.authority + '-2',
        notifTimer
      );
    }
  }

  private verifyPayment(query: BankGatewayVerifyArgs) {
    const bankPlugin = store.plugins.get(
      ShopPluginType.BANK_GATEWAY
    ) as BankGatewayPluginContent;
    if (!bankPlugin) throw new NotImplement('bank gateway plugin not exist');

    return bankPlugin.stack[1](query);
  }

  private async unverifiedPayments() {
    const bankPlugin = store.plugins.get(
      ShopPluginType.BANK_GATEWAY
    ) as BankGatewayPluginContent;
    if (!bankPlugin) return [];
    return await bankPlugin.stack[2]();
  }

  async synchronize() {
    try {
      const taskId = [];
      const _unverified_authorities = async () => {
        const unverified = await this.unverifiedPayments();
        // unverified authorities
        return unverified.map(async ({ authority, ...props }) => {
          if (taskId.includes(authority)) return;
          taskId.push(authority);
          const order = await this.getNeedToPayOrder(
            {
              'transaction.authority': authority,
            },
            false
          );
          if (!order) return;
          return await this.handlePayment(order, true, false, props);
        });
      };
      const _expired_transactions = async () => {
        const expiredTransactions = await this.orderModel.find({
          'transaction.expiredAt': { $lt: new Date() },
          status: OrderStatus.NeedToPay,
          active: true,
        });
        // expired transactions
        return expiredTransactions.map((order) => {
          if (taskId.includes(order.transaction.authority)) return;
          taskId.push(order.transaction.authority);
          return this.handlePayment(order, true, true);
        });
      };
      const _watcher_transactions = async () => {
        const openTransactions = await this.orderModel.find({
          active: true,
          status: OrderStatus.NeedToPay,
          'transaction.expiredAt': { $gt: new Date() },
        });
        return openTransactions.map((order) => {
          if (taskId.includes(order.transaction.authority)) return;
          taskId.push(order.transaction.authority);
          return this.transactionSupervisor(order, {
            expired_watcher: true,
            watchers_timeout:
              order.transaction.expiredAt.getTime() - Date.now(),
          });
        });
      };
      const promises = [
        ...(await _unverified_authorities()),
        ...(await _expired_transactions()),
        ...(await _watcher_transactions()),
      ];
      // execute parallel
      await Promise.all(promises);
    } catch (err) {
      logger.error('order sync job error\n', axiosError2String(err));
    }
  }
}

const transactionService = new TransactionService();
export default transactionService;
