import { ApiUrl, SaveData } from '..';
import API from '../API';
import store from '../store';

export class CartService {
  static parseCart(cart) {
    const newCart = {};
    for (const product of cart) {
      for (const comb of product.combinations) {
        newCart[comb._id] = { ...comb, ...product };
      }
    }
    return newCart;
  }
  static parseProduct(product) {
    return {
      _id: product.id,
      combinations: product.combinations.map((c) => ({
        _id: c.id,
        quantity: c.quantity,
      })),
    };
  }

  static parseComb(comb) {
    return { quantity: comb.quantity };
  }

  static async query(config) {
    const response = await API({
      baseURL: `${ApiUrl}/order/cart`,
      no_redirect: true,
      validateStatus(code) {
        return code < 400 || code === 401;
      },
      url: '/',
      ...config,
    });
    return response?.data?.data;
  }

  static async get(notLocal) {
    try {
      const cart = await this.query({
        method: 'get',
      });

      if (!cart) throw new Error('no cart');

      return this.parseCart(cart);
    } catch (err) {
      if (!notLocal) return store.getState().store?.cart ?? {};
    }
  }

  static async modify(product, combination) {
    const localProduct = { ...combination, ...product };
    const body = this.parseComb(combination);
    console.log({ product, combination });
    await this.query({
      method: 'put',
      url: `/${product._id}/${combination._id}`,
      data: body,
    });

    const localCart = store.getState().store?.cart ?? {};
    localCart[combination._id] = localProduct;
    SaveData({ cart: localCart });
  }

  static async delete(productId, combinationId) {
    await this.query({
      method: 'delete',
      url: `/${productId}/${combinationId}`,
    });

    const localCart = store.getState().store?.cart ?? {};
    delete localCart[combinationId];
    SaveData({ cart: localCart });
  }

  static async sync() {
    const localCart = store.getState().store?.cart ?? {};
    const onlineCart = (await this.get(true)) ?? {};

    const modifyComIds = [];

    for (const comId in localCart) {
      const matchProduct = onlineCart[comId];
      if (!matchProduct || matchProduct.quantity !== localCart[comId].quantity)
        modifyComIds(comId);
    }

    for (const comId of modifyComIds) {
      await this.modify(localCart[comId], { ...localCart[comId], _id: comId });
    }
  }
}
