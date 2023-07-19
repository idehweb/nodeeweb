import {
  MiddleWare,
  store,
  NotFound,
  DuplicateError,
  ForbiddenError,
  LimitError,
  BadRequestError,
} from '@nodeeweb/core';
import { OrderModel, OrderStatus } from '../../schema/order.schema';
import { ProductModel } from '../../schema/product.schema';
import { DEFAULT_CART_LIMIT } from '../../constants/limit';
import { Types } from 'mongoose';
import logger from '../../utils/log';

export default class CartService {
  static get orderModel() {
    return store.db.model('order') as OrderModel;
  }
  static get productModel() {
    return store.db.model('product') as ProductModel;
  }

  static getCart: MiddleWare = async (req, res) => {
    const order = await CartService.orderModel.findOne(
      {
        'customer._id': req.user.id,
        status: OrderStatus.Cart,
        active: true,
      },
      {
        products: 1,
        totalPrice: 1,
      }
    );

    return res.json({
      data: order?.products ?? [],
    });
  };
  static addToCart: MiddleWare = async (req, res) => {
    const quantity = +req.body.product?.quantity || 1;
    const productId = req.body.product?.id;
    const product = await CartService.productModel.findOne({
      _id: productId,
      active: true,
    });

    if (!product) throw new NotFound('Product not found');

    // quantity limit
    if (product.quantity < quantity)
      throw new BadRequestError(
        `there is not enough product , product available quantity : ${product.quantity}`
      );

    const order = await CartService.orderModel.findOne({
      'customer._id': req.user._id,
      status: OrderStatus.Cart,
      active: true,
    });

    if (!order) {
      // create order
      const order = await CartService.orderModel.create({
        customer: req.user,
        products: [{ ...product.toObject(), quantity }],
      });
      return res.status(201).json({
        data: order,
      });
    } else {
      //  same product id
      if (order.products.find((doc) => doc._id.equals(productId)))
        throw new DuplicateError('Can not add product in cart twice');

      // cart limit
      if (order.products.length + 1 > DEFAULT_CART_LIMIT)
        throw new LimitError('max products in cart');

      // push to cart
      const newOrder = await CartService.orderModel.findOneAndUpdate(
        { _id: order._id },
        {
          $push: {
            products: { ...product.toObject(), quantity },
          },
        }
      );

      return res.json({ data: newOrder });
    }
  };
  static editCart: MiddleWare = async (req, res) => {
    const quantity = +req.body.product.quantity;
    const productId = req.body.product.id;
    if (!quantity) throw new BadRequestError('quantity must be grater than 0');

    const product = await CartService.productModel.findOne({
      _id: productId,
      active: true,
    });

    if (!product) throw new NotFound('Product not found');

    // quantity limit
    if (product.quantity < quantity)
      throw new BadRequestError(
        `there is not enough product , product available quantity : ${product.quantity}`
      );

    const order = await CartService.orderModel.findOneAndUpdate(
      {
        'customer._id': req.user.id,
        'products._id': req.body.product.id,
        status: OrderStatus.Cart,

        active: true,
      },
      {
        $set: {
          'products.$.quantity': quantity,
        },
      }
    );

    if (!order) throw new NotFound('order not found');
    return res.json({ data: order });
  };
  static removeFromCart: MiddleWare = async (req, res) => {
    const order = await CartService.orderModel.updateOne(
      {
        'customer._id': req.user._id,
        status: OrderStatus.Cart,
        active: true,
      },
      {
        $pull: {
          products: { _id: new Types.ObjectId(req.params.productId) },
        },
      },
      { new: true }
    );
    if (!order?.modifiedCount)
      throw new NotFound('not found any order with that product id');

    return res.status(204).send('success');
  };
}
