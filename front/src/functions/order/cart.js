import { ApiUrl, SaveData } from '..';
import API from '../API';
import store from '../store';

export class CartService {
  static parse(product) {
    return {
      _id: product.id,
      combinations: product.combinations.map((c) => ({
        _id: c.id,
        quantity: c.quantity,
      })),
    };
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
      return cart;
    } catch (err) {
      if (!notLocal) return store.getState().store?.cart ?? [];
    }
  }

  static async create(product) {
    const body = {
      products: [this.parse(product)],
    };
    await this.query({ method: 'post', data: body });

    const localCart = store.getState().store?.cart ?? [];
    localCart.push(product);

    SaveData({ cart: localCart });
  }

  static async update(product) {
    const body = {
      products: [this.parse(product)],
    };
    await this.query({ method: 'put', data: body });

    const localCart = store.getState().store?.cart ?? [];
    const newCart = localCart.map((p) => {
      const id = p._id || p.id;
      const isMine = id === product.id;
      if (!isMine) return p;
      p.combinations = p.combinations.map((comb) => {
        const id = comb._id || comb.id;
        const productComb = product.combinations.find((c) => c._id === id);
        if (productComb) comb = { ...comb, ...productComb };
        return comb;
      });
      return p;
    });

    SaveData({ cart: newCart });
  }

  static async delete(productId, combinationId) {
    await this.query({
      method: 'delete',
      url: `/${productId}/${combinationId}`,
    });

    const localCart = store.getState().store?.cart ?? [];
    const newCart = localCart
      .map((p) => {
        const id = p._id || p.id;
        if (id !== productId) return p;
        p.combinations = p.combinations.filter(
          (comb) => comb._id !== combinationId,
        );
        return p;
      })
      .filter((p) => p.combinations.length);

    SaveData({ cart: newCart });
  }

  static async sync() {
    const localCart = store.getState().store?.cart ?? [];
    const onlineCart = (await this.get(true)) ?? [];

    const createProducts = [],
      updateProducts = [];

    for (const p of localCart) {
      const matchProduct = onlineCart.find((product) => product._id === p._id);

      if (!matchProduct) createProducts(p);
      else updateProducts(p);
    }

    if (createProducts.length) {
      await this.query({
        method: 'post',
        data: { products: createProducts.map(this.parse) },
      });
    }
    if (updateProducts.length) {
      await this.query({
        method: 'put',
        data: { products: updateProducts.map(this.parse) },
      });
    }
  }
}
