import { ApiUrl, SaveData } from '..';
import API from '../API';
import store from '../store';

export class CartService {
  static getQuantity(comId) {
    return this.getLocal()[comId]?.quantity ?? 0;
  }
  static async getAndSync(opt) {
    await this.sync();
    const resFromServer = await this.get(true, opt);
    return resFromServer;
  }

  static getCartLength(cart) {
    const pIds = {};
    Object.values(cart).forEach((v) => (pIds[v.id] = 1));
    return Object.values(pIds).reduce((prev, curr) => prev + curr, 0);
  }

  static parse2List(cart) {
    const newCart = [];
    for (const product of cart) {
      const totalQ = product.combinations.reduce(
        (prev, curr) => curr.quantity + prev,
        0
      );
      const totalP = product.combinations.reduce(
        (prev, curr) => (curr.salePrice ?? curr.price) + prev,
        0
      );

      newCart.push({ ...product, count: totalQ, price: totalP });
    }
    return newCart;
  }

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

  static getLocal() {
    return store.getState().store?.cart ?? {};
  }

  static async get(notLocal, { listForm, objectForm } = { objectForm: true }) {
    try {
      const cart = await this.query({
        method: 'get',
      });

      if (!cart) throw new Error('no cart');

      return listForm ? this.parse2List(cart) : this.parseCart(cart);
    } catch (err) {
      if (!notLocal) return this.getLocal();
      throw err;
    }
  }

  static async modify(product, combination) {
    const localProduct = { ...product, ...combination };
    localProduct._id = product._id;
    localProduct.id = product.id;
    const body = this.parseComb(combination);
    const canAdd = await this.query({
      method: 'put',
      url: `/${product._id}/${combination._id}`,
      data: body,
    });

    const localCart = store.getState().store?.cart ?? {};
    localCart[combination._id] = localProduct;
    SaveData({ cart: { ...localCart } });
    return canAdd;
  }

  static set(products, configs = {}) {
    return this.query({ ...configs, method: 'put', data: { products } });
  }

  static async delete(productId, combinationId) {
    await this.query({
      method: 'delete',
      url: `/${productId}/${combinationId}`,
    });

    const localCart = store.getState().store?.cart ?? {};
    delete localCart[combinationId];
    SaveData({ cart: { ...localCart } });
  }

  static async sync() {
    const localCart = store.getState().store?.cart ?? {};
    const products = Object.values(
      Object.entries(localCart)
        .map(([comId, p]) => ({
          _id: p._id,
          combinations: [{ _id: comId, quantity: p.quantity }],
        }))
        .reduce((prev, curr) => {
          if (prev[curr._id]) prev[curr._id].push(curr);
          else prev[curr._id] = [curr];
          return prev;
        }, {})
    ).map((combs) =>
      combs.reduce(
        (prev, curr) => {
          return {
            _id: curr._id,
            combinations: [...prev.combinations, ...curr.combinations],
          };
        },
        { combinations: [] }
      )
    );

    await this.set(products, {
      validateStatus(code) {
        return code < 400;
      },
      no_redirect: false,
    });
  }

  static clear() {
    SaveData({ cart: {} });
  }
}
