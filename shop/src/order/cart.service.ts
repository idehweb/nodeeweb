import {
  MiddleWare,
  NotFound,
  DuplicateError,
  LimitError,
  ValidationError,
} from '@nodeeweb/core';
import store from '../../store';
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
  static checkProductPrice({
    product,
    productDoc,
  }: {
    product: ProductBody;
    productDoc: ProductDocument;
  }) {
    const productCombinationsInDoc = productDoc.combinations;

    product.combinations.forEach((combination) => {
      const docCombinations = productCombinationsInDoc.find(
        ({ _id }) => _id === combination._id
      );

      if (
        docCombinations.price === undefined ||
        docCombinations.salePrice === undefined
      )
        throw new ValidationError(
          `product with ID ${product._id.toString()} in combination with ID ${
            docCombinations._id
          } has no valid price`
        );
    });
  }

  static async _checkProduct({
    product,
    type,
    user,
    order,
    strict,
  }: {
    type: 'add' | 'edit' | 'modify-comb';
    order?: OrderDocument;
    product: {
      _id: Types.ObjectId;
      combinations: {
        _id: string;
        quantity: number;
      }[];
    };
    user: UserDocument;
    strict?: boolean;
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
      if (!productInOrder && strict)
        throw new NotFound('Product in order must exist');
      if (
        productCombinationsInOrder?.length !== product.combinations.length &&
        ProductCombinationsInDoc?.length !== product.combinations.length
      )
        throw new NotFound('Some product combinations not exits');
    } else {
      if (ProductCombinationsInDoc?.length !== product.combinations.length)
        throw new NotFound('Some product combinations not exits');
    }

    // price checker
    this.checkProductPrice({ product, productDoc });

    // quantity rules
    this.checkProductQuantity({ product, productDoc });

    // restrict rules
    if ((type === 'add' || type === 'modify-comb') && orderDoc) {
      if (
        orderDoc.products.length + 1 >
        store.config.limit.max_products_in_cart
      )
        throw new LimitError('products in order limit exceeded');

      if (productInOrder && type === 'add' && strict)
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
      combinations: mergedCombinations as any,
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
        type: order ? 'add' : 'edit',
        product,
        user: req.user,
        order,
      });
    }

    // merge products
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
      const newOrder = await this.orderModel.findOneAndUpdate(
        { _id: order._id },
        { products },
        { new: true }
      );
      return res.json({ data: newOrder });
    }
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

  static modifyComb: MiddleWare = async (req, res) => {
    const { productId, combId } = req.params;

    const body = {
      _id: new Types.ObjectId(productId),
      combinations: [
        {
          ...req.body,
          _id: combId,
        },
      ],
    };

    const productDoc = await this.productModel.findOne({
      _id: body._id,
      'combinations._id': combId,
    });

    if (!productDoc)
      throw new NotFound('product with this combination not found');

    const cart = await CartService.orderModel.findOne({
      'customer._id': req.user._id,
      status: OrderStatus.Cart,
      active: true,
    });

    const myProduct = cart?.products?.find((p) => p._id.equals(productId));
    const myComb = myProduct?.combinations?.find((c) => c._id === combId);

    await CartService._checkProduct({
      type: 'modify-comb',
      order: cart,
      product: body,
      user: req.user,
    });

    const productCart = this.pDoc2pCart(productDoc, [body]);

    // cart not exist
    if (!cart) {
      const order = await CartService.orderModel.create({
        customer: req.user.toObject(),
        products: [productCart],
      });
      return res.status(201).json({
        data: order,
      });
    }

    const cartProducts = [...cart.products];

    // add product in cart
    if (!myProduct) {
      cartProducts.push(productCart);
    }
    // add comb
    else if (!myComb) {
      myProduct.combinations.push(...productCart.combinations);
    }
    // modify comb
    else {
      myProduct.combinations = myProduct.combinations.map((comb) => {
        if (comb._id !== combId) return comb;
        return productCart.combinations[0];
      });
    }

    const newCart = await CartService.orderModel.findOneAndUpdate(
      { _id: cart._id },
      {
        products: cartProducts,
      },
      { new: true }
    );
    return res.status(200).json({
      data: newCart,
    });
  };

  static deleteComb: MiddleWare = async (req, res) => {
    const { productId, combId } = req.params;

    const productDoc = await this.productModel.findOne({
      _id: productId,
      'combinations._id': combId,
    });

    if (!productDoc)
      throw new NotFound('product with this combination not found');

    const cart = await CartService.orderModel.findOne({
      'customer._id': req.user._id,
      'products._id': productId,
      'products.combinations._id': combId,
      status: OrderStatus.Cart,
      active: true,
    });

    if (!cart)
      throw new NotFound('product with this combination not found in cart');

    const cartCombinations = cart.products.reduce(
      (acc, p) => acc + p.combinations.length,
      0
    );

    const myProduct = cart.products.find((p) => p._id.equals(productId));

    const rmCart = async () => {
      await this.orderModel.deleteOne({ _id: cart._id });
    };

    const popProduct = async () => {
      await this.orderModel.updateOne(
        { _id: cart._id },
        {
          $pull: {
            products: { _id: productId },
          },
        }
      );
    };

    const popComb = async () => {
      await this.orderModel.updateOne(
        { _id: cart._id, 'products._id': productId },
        {
          $pull: {
            'products.$.combinations': { _id: combId },
          },
        }
      );
    };

    if (cartCombinations === 1) await rmCart();
    else if (myProduct.combinations.length === 1) await popProduct();
    else await popComb();

    return res.status(204).send();
  };

  static checkout: MiddleWare = async (req, res) => {
    const order = await this.orderModel.findOneAndUpdate(
      {
        'customer._id': req.user.id,
        status: OrderStatus.Cart,
        active: true,
      },
      {
        checkout: true,
      },
      { new: true }
    );

    if (!order) throw new NotFound('there is not any active cart');

    return res.status(200).json({ data: order });
  };
}
