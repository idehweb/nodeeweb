import { isNil } from 'lodash';
import {
  BadRequestError,
  ErrorType,
  GeneralError,
  LimitError,
  MiddleWare,
  NotFound,
} from '@nodeeweb/core';
import {
  IOrder,
  OrderDocument,
  OrderModel,
  OrderStatus,
} from '../../schema/order.schema';
import { ProductDocument, ProductModel } from '../../schema/product.schema';
import { Types } from 'mongoose';
import { DiscountDocument, DiscountModel } from '../../schema/discount.schema';
import { roundPrice } from '../../utils/helpers';
import utils from './utils.service';
import { PostGatewayPluginContent, ShopPluginType } from '../../types/plugin';
import discountService from '../discount/service';
import store from '../../store';
import postService from './post.service';
import { CreateTransactionBody } from '../../dto/in/order/transaction';
import paymentService from '../transaction/payment.service';
import transactionUtils from '../transaction/utils.service';

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

  createTransaction: MiddleWare = async (req, res) => {
    const body: CreateTransactionBody = req.body;

    // 0. check shop available
    if (!store.config.shop_active)
      throw new GeneralError(
        store.config.shop_inactive_message,
        503,
        ErrorType.Unavailable
      );

    // 1. check user maximum need paid transaction
    const needToPayOrders = await this.orderModel
      .find({
        'customer._id': req.user._id,
        status: OrderStatus.NeedToPay,
        active: true,
      })
      .count();

    if (needToPayOrders > store.config.limit.max_need_to_pay_order)
      throw new LimitError(
        'Maximum need to pay order , please paid them first'
      );

    // 2. find order
    const order = await this.orderModel.findOne({
      'customer._id': req.user._id,
      status: OrderStatus.Cart,
      'products.0': { $exists: true },
      active: true,
    });
    if (!order) throw new NotFound('order not found');

    // 3. check product combinations
    const products = await this.productModel.find({
      _id: { $in: order.products.map((p) => p._id) },
      active: true,
    });
    this.productCheck(order, products);

    // 4. discount
    let discount: DiscountDocument;
    if (body.discount) {
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
      post: body.post,
      address: body.address,
      tax: true,
      total: true,
    });

    // 6. create transaction
    const transaction = await paymentService.createTransaction({
      amount: totalPrice,
      order,
      user: req.user,
      pluginSlug: body.pluginSlug,
    });

    // 7. fill post, post if not payment issue
    let post: IOrder['post'] = await postService.getPostProvider(
      body.post.id,
      body.address
    );
    if (!totalPrice) {
      post = { ...post, ...(await this.submitPostReq(order)) };
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
          address: body.address,
          discount: {
            code: body.discount,
            amount: discountPrice,
          },
          post: body.post ? { ...body.post, ...post, price: postPrice } : post,
          status: totalPrice ? OrderStatus.NeedToPay : OrderStatus.Posting,
          tax: taxesPrice,
          totalPrice,
          transactions: [transactionUtils.convertTransaction2Grid(transaction)],
        },
      },
      { new: true }
    );

    // 9. send sms if payment completed by discount
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
    if (req.query.address) {
      extraOpt.address = JSON.parse(req.query.address as string);
    }

    return res.json({
      data: await this.calculatePrice(order, { ...req.query, ...extraOpt }),
    });
  };

  private productCheck(order: OrderDocument, products: ProductDocument[]) {
    let activeCheck: Types.ObjectId[] = [],
      priceCheck: Types.ObjectId[] = [],
      quantityCheck: Types.ObjectId[] = [],
      inStockCheck: Types.ObjectId[] = [];

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

      p.combinations.forEach((comb) => {
        const productCombination = mp.combinations.find(
          (d) => d._id === comb._id
        );
        if (!productCombination.in_stock) inStockCheck.push(p._id);
        if (
          utils.getPrice(productCombination, false) !==
            utils.getPrice(comb, false) ||
          isNil(utils.getPrice(productCombination, false))
        )
          priceCheck.push(p._id);
        if (productCombination.quantity - comb.quantity < 0)
          quantityCheck.push(p._id);
      });
    });
    const errors = [
      activeCheck,
      priceCheck,
      quantityCheck,
      inStockCheck,
    ].flat();
    if (errors.length)
      throw new BadRequestError(
        `these products must be change\n${[
          ...new Set(errors.map((id) => id.toString())),
        ].join(',')}`
      );
  }

  private async getPostPrice(
    postId: string,
    products: ProductDocument[],
    address: Omit<IOrder['address'], 'receiver'>
  ) {
    const provider = await postService.getPostProvider(postId, address);
    if (!provider)
      throw new NotFound(`post provider not found with ID ${postId}`);

    return postService.calculatePrice(provider, products, address);
  }

  private submitPostReq(order: OrderDocument): Promise<IOrder['post']> {
    const postPlugin = store.plugins.get(
      ShopPluginType.POST_GATEWAY
    ) as PostGatewayPluginContent;
    if (!postPlugin) return;

    return postPlugin.stack[1]({
      address: order.address,
      products: order.products.flatMap((p) => p.combinations),
    });
  }

  private async calculatePrice(
    order: OrderDocument,
    opt: {
      post?: {
        id: string;
        provider?: string;
      };
      address?: Omit<IOrder['address'], 'receiver'>;
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
      taxRate: string,
      totalPrice: number;

    const products = order?.products ?? [];

    const _post = async () =>
      postPrice !== undefined
        ? postPrice
        : opt.post
        ? roundPrice(
            await this.getPostPrice(opt.post?.id, products as any, opt.address)
          )
        : 0;
    const _products = () =>
      productsPrice
        ? productsPrice
        : roundPrice(
            products.reduce(
              (acc, { combinations }) =>
                acc +
                combinations.reduce(
                  (acc, comb) => acc + utils.getPrice(comb, true),
                  0
                ),
              0
            )
          );
    const _total_before_tax = async () => {
      if (totalPrice_before_taxes !== undefined) return totalPrice_before_taxes;
      let p = postPrice,
        pp = productsPrice;
      if (!p) p = await _post();
      if (!pp) pp = _products();
      return roundPrice(p + pp);
    };
    const _taxesPrice = async () => {
      if (taxesPrice) return taxesPrice;
      return roundPrice(store.config.tax * (await _total_before_tax()));
    };
    const _taxRate = () => {
      if (taxRate) return taxRate;
      taxRate = `${store.config.tax * 100}%`;
      return taxRate;
    };
    const _total_before_discount = async () => {
      return totalPrice_before_discount
        ? totalPrice_before_discount
        : roundPrice((await _taxesPrice()) + (await _total_before_tax()));
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
    taxesPrice = opt.tax ? await _taxesPrice() : undefined;
    totalPrice_before_discount = opt.total
      ? await _total_before_discount()
      : undefined;
    totalPrice = opt.total ? await _total() : undefined;
    taxRate = opt.tax ? _taxRate() : undefined;

    return {
      postPrice,
      productsPrice,
      totalPrice_before_taxes,
      taxesPrice,
      taxRate,
      totalPrice_before_discount,
      discount,
      totalPrice,
    };
  }
}

const transactionService = new TransactionService();
export default transactionService;
