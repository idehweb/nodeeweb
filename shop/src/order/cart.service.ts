import {
  MiddleWare,
  store,
  NotFound,
  DuplicateError,
  ForbiddenError,
  LimitError,
  BadRequestError,
  ValidationError,
} from '@nodeeweb/core';
import {
  OrderDocument,
  OrderModel,
  OrderStatus,
} from '../../schema/order.schema';
import { ProductDocument, ProductModel } from '../../schema/product.schema';
import { Types } from 'mongoose';
import {
  AddToCartBody,
  ProductBody,
  UpdateCartBody,
} from '../../dto/in/order/cart';
import { UserDocument } from '@nodeeweb/core/types/user';
import logger from '../../utils/log';

export default class CartService {
  static get orderModel() {
    return store.db.model('order') as OrderModel;
  }
  static get productModel() {
    return store.db.model('product') as ProductModel;
  }

  static checkProductQuantity({
    product,
    productDoc,
  }: {
    product: ProductBody;
    productDoc: ProductDocument;
  }) {
    const productCombinationsInDoc = productDoc.combinations;

    product.combinations.forEach((combinations) => {
      const docCombinations = productCombinationsInDoc.find(
        ({ _id }) => _id === combinations._id
      );
      if (!docCombinations.in_stock)
        throw new ValidationError(`${product._id.toString()} is'nt in stock`);
      if (docCombinations.quantity < combinations.quantity)
        throw new ValidationError(
          `product with ID ${product._id.toString()} in combination with ID ${
            docCombinations._id
          } has insufficient quantity`
        );
    });
  }

  static async _checkProduct({
    product,
    type,
    user,
    order,
  }: {
    type: 'add' | 'edit';
    order?: OrderDocument;
    product: {
      _id: Types.ObjectId;
      combinations: {
        _id: string;
        quantity: number;
      }[];
    };
    user: UserDocument;
  }) {
    // existence
    const productDoc = await this.productModel.findOne({
      _id: product._id,
      active: true,
    });
    const orderDoc =
      order === undefined
        ? await this.orderModel.findOne({
            'customer._id': user._id,
            status: OrderStatus.Cart,
            active: true,
          })
        : order;

    const productInOrder = orderDoc?.products.find(({ _id }) =>
      product._id.equals(_id)
    );
    const productCombinationsInOrder = productInOrder?.combinations.filter(
      ({ _id }) => product.combinations.find(({ _id: mId }) => mId === _id)
    );
    const ProductCombinationsInDoc = productDoc?.combinations.filter(
      ({ _id }) => product.combinations.find(({ _id: mId }) => mId === _id)
    );

    if (!productDoc) throw new NotFound('Product not found');
    if (type === 'edit') {
      if (!orderDoc) throw new NotFound('Order not found');
      if (!productInOrder) throw new NotFound('Product in order must exist');
      if (productCombinationsInOrder?.length !== product.combinations.length)
        throw new NotFound('Some product combinations not exits');
    } else {
      if (ProductCombinationsInDoc?.length !== product.combinations.length)
        throw new NotFound('Some product combinations not exits');
    }

    // quantity rules
    this.checkProductQuantity({ product, productDoc });

    // restrict rules
    if (type === 'add' && orderDoc) {
      if (orderDoc.products.length + 1 > store.settings.MAX_PRODUCTS_IN_CART)
        throw new LimitError('products in order limit exceeded');

      if (productInOrder)
        throw new DuplicateError('Can not add product in cart twice');
    }
  }
  static pDoc2pCart(
    product: ProductDocument | OrderDocument['products'][0],
    productsBody: ProductBody[]
  ): OrderDocument['products'][0] {
    const productInBody = productsBody.find((p) => {
      return p._id.equals(product._id);
    });

    if (!productInBody) return product as OrderDocument['products'][0];
    const mergedCombinations = productInBody.combinations.map((d) => {
      let productCombination = product.combinations.find(
        (combinations) => d._id === combinations._id
      );

      if (productCombination['_doc'])
        productCombination = productCombination['_doc'];

      return {
        ...productCombination,
        ...d,
      };
    });

    return {
      _id: product._id,
      combinations: mergedCombinations,
      miniTitle: product.miniTitle,
      title: product.title,
      image: product['image'] ?? product['thumbnail'],
    };
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
    const body: AddToCartBody = req.body;
    const order = await CartService.orderModel.findOne({
      'customer._id': req.user._id,
      status: OrderStatus.Cart,
      active: true,
    });

    // validate
    for (const product of body.products) {
      await CartService._checkProduct({
        type: 'add',
        product,
        user: req.user,
        order,
      });
    }

    const products = (
      await this.productModel.find({
        _id: { $in: body.products.map((p) => p._id) },
      })
    ).map((p) => this.pDoc2pCart(p, body.products));

    if (!order) {
      // create order
      const order = await CartService.orderModel.create({
        customer: req.user.toObject(),
        products,
      });
      return res.status(201).json({
        data: order,
      });
    } else {
      // push to cart
      const newOrder = await CartService.orderModel.findOneAndUpdate(
        { _id: order._id },
        {
          $push: {
            products,
          },
        },
        { new: true }
      );

      return res.status(201).json({ data: newOrder });
    }
  };

  static editCart: MiddleWare = async (req, res) => {
    const body: UpdateCartBody = req.body;
    const order = await CartService.orderModel.findOne({
      'customer._id': req.user._id,
      status: OrderStatus.Cart,
      active: true,
    });

    // validate
    for (const product of body.products) {
      await CartService._checkProduct({
        type: 'edit',
        product,
        user: req.user,
        order,
      });
    }

    // merge products
    const products = order.products.map((p) =>
      this.pDoc2pCart(p, body.products)
    );

    const newOrder = await this.orderModel.findOneAndUpdate(
      { _id: order._id },
      { products },
      { new: true }
    );
    return res.json({ data: newOrder });
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
