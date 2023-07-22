import {
  BadRequestError,
  GeneralError,
  LimitError,
  MiddleWare,
  NotFound,
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
import { Types } from 'mongoose';
import { DiscountDocument, DiscountModel } from '../../schema/discount.schema';
import { roundPrice } from '../../utils/helpers';
import { UserDocument } from '@nodeeweb/core/types/auth';
import { INACTIVE_PRODUCT_TIME } from '../constants/limit';
import utils from './utils.service';
import {
  BankGatewayPluginContent,
  PluginType,
} from '@nodeeweb/core/types/plugin';

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
      if (p.quantity - mp.quantity < 0) quantityCheck.push(p._id);
    });

    const errors = [activeCheck, priceCheck, quantityCheck].flat();
    if (errors.length)
      throw new BadRequestError(
        `these products must be change\n${errors
          .map((id) => id.toString())
          .join(',')}`
      );
  }

  private async detectDiscount(
    discountCode: string,
    userId: Types.ObjectId,
    consume: boolean
  ) {
    const query = {
      $and: [
        {
          code: discountCode,
          active: true,
          consumers: {
            $ne: userId,
          },
          usageLimit: { $gt: 0 },
        },
        {
          // expired at
          $or: [
            { expiredAt: { $exists: false } },
            { expiredAt: { $gte: new Date() } },
          ],
        },
      ],
    };

    const discount = consume
      ? await this.discountModel.findOneAndUpdate(
          query,
          {
            $inc: {
              usageLimit: -1,
            },
            $push: {
              consumers: userId,
            },
          },
          { new: true }
        )
      : await this.discountModel.findOne(query);

    if (!discount) throw new NotFound('discount not found');

    return discount;
  }

  private async getPostPrice(
    products: ProductDocument[],
    address: Omit<IOrder['address'], 'receiver'>,
    provider?: string
  ) {
    return 0;
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

    const products = order.products;

    const _post = async () =>
      postPrice !== undefined
        ? postPrice
        : opt.post
        ? roundPrice(
            await this.getPostPrice(
              products as any,
              opt.post.address,
              opt.post.provider
            )
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
      totalPrice_before_discount,
      taxesPrice,
      totalPrice,
      discount,
    };
  }

  private async createPaymentLink(
    amount: number,
    products: ProductDocument[],
    userPhone: string,
    signal?: AbortSignal
  ): Promise<Partial<OrderDocument['transaction']>> {
    const bankPlugin = store.plugins.get(
      PluginType.BANK_GATEWAY
    ) as BankGatewayPluginContent;

    if (!bankPlugin)
      return {
        authority: new Date() + '',
        provider: TransactionProvider.Manual,
      };

    // env
    // if (envAllowed([Environment.Local])) {
    //   return ['https://example.com', '' + Date.now()];
    // }

    const description = `برای خرید محصولات ${products
      .map(({ name }) => name)
      .join(' ، ')} از فروشگاه ${store.env.APP_NAME}`;

    return await bankPlugin.stack[0]({
      amount,
      callback_url: `${store.env.BASE_URL}/api/v1/shop/payment_callback?amount=${amount}`,
      currency: 'IRT',
      description,
      userPhone,
    });
  }

  getDiscount: MiddleWare = async (req, res) => {
    const discount = await this.detectDiscount(
      req.params.discountId,
      req.user._id,
      false
    );
    return res.json({
      data: {
        code: discount.code,
        amount: discount.amount,
        maxAmount: discount.maxAmount,
        percentage: discount.percentage,
        expiredAt: discount.expiredAt,
      },
    });
  };

  createTransaction: MiddleWare = async (req, res) => {
    const transactionController = new AbortController();
    // set abort controller when request is closed
    req.socket.on('close', () => {
      transactionController.abort('Request Closed');
    });

    // 1. check user maximum need paid transaction
    const tds = await this.orderModel
      .find({
        'customer._id': req.user._id,
        status: OrderStatus.NeedToPay,
        active: true,
      })
      .count();

    if (tds > MAXIMUM_NEED_TO_PAY_TRANSACTION)
      throw new LimitError(
        'Maximum need to pay transaction , please paid them first'
      );

    // 2. find order
    const order = await this.orderModel.findOne({
      _id: req.params.orderId,
      'customer._id': req.user._id,
      status: OrderStatus.Cart,
      active: true,
    });
    if (!order) throw new NotFound();

    // 3. check product details
    const products = await this.productModel.find({
      _id: { $in: order.products.map((p) => p._id) },
      active: true,
    });
    this.productCheck(order, products);

    // 4. discount
    let discount: DiscountDocument;
    if (req.body.discount) {
      discount = await this.detectDiscount(
        req.body.discount,
        req.user._id,
        true
      );
    }

    // 5. pricing and verify post
    const {
      postPrice,
      taxesPrice,
      totalPrice,
      discount: discountPrice,
    } = await this.calculatePrice(order, {
      discount,
      post: req.post,
      tax: true,
      total: true,
    });

    let transaction: Partial<OrderDocument['transaction']> = {};
    // zero payment
    if (!totalPrice) {
      transaction.authority = Date.now() + '';
      transaction.provider = TransactionProvider.Manual;
    } else {
      // 6. create payment link
      transaction = await this.createPaymentLink(
        totalPrice,
        products,
        req.user.phone,
        transactionController.signal
      );
    }

    // 7. update order
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
            ? { ...req.body.post, price: postPrice }
            : undefined,
          status: OrderStatus.NeedToPay,
          tax: taxesPrice,
          totalPrice,
          transaction,
        },
      },
      { new: true }
    );

    // 8. active supervisor
    await this.transactionSupervisor(req.user, newOrder, {
      clear: true,
      expired_watcher: totalPrice ? true : false,
      notif_watcher: totalPrice ? true : false,
    });

    if (!totalPrice) {
      // send change state sms
      utils.sendOnStateChange(req.user, newOrder)?.then();
    }

    return res.status(201).json({ data: newOrder });
  };

  private async transactionSupervisor(
    user: UserDocument,
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
    if (expired_watcher) {
      // create watcher
      // 1. Expire
      const expiredTimer = setTimeout(async () => {
        try {
          this.transactionSupervisors.delete(
            order.transaction.authority + '-1'
          );
          const td = await this.orderModel.findOne({
            _id: order._id,
            state: OrderStatus.NeedToPay,
          });
          if (!td) return;
          await this.handlePayment(td, true, true, true);
        } catch (err) {}
      }, watchers_timeout);
      this.transactionSupervisors.set(
        order.transaction.authority + '-1',
        expiredTimer
      );
    }

    if (notif_watcher) {
      //2. Notification Before Expired
      const notifTimer = setTimeout(async () => {
        try {
          this.transactionSupervisors.delete(
            order.transaction.authority + '-2'
          );
          const td = await this.orderModel.findOne({
            _id: order._id,
            state: OrderStatus.NeedToPay,
            active: true,
          });
          if (!td) return;
          utils.sendOnExpire(user, order)?.then();
        } catch (err) {}
      }, watchers_timeout * 0.6);
      this.transactionSupervisors.set(
        order.transaction.authority + '-2',
        notifTimer
      );
    }
  }
}

const transactionService = new TransactionService();
export default transactionService;
