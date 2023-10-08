import { ApiUrl } from '..';
import API from '../API';
import UserService from '../User';
import store from '../store';
import { OrderUtils } from './utils';

export class OrderService {
  static async query(config) {
    const response = await API({
      baseURL: `${ApiUrl}/order`,
      url: '/',
      ...config,
    });
    return response?.data?.data;
  }
  static get(params) {
    return this.query({
      params,
      method: 'get',
    });
  }

  static async getCartOrderId() {
    const [order] = await this.get({ status: 'cart', _limit: 1 });
    return order._id;
  }

  static checkout(orderId) {
    return this.query({
      method: 'put',
      data: {
        status: 'checkout',
      },
      url: `/${orderId}`,
    });
  }

  static getPostOptions() {
    const address = OrderUtils.getAddressChose() ?? {};
    return this.query({
      method: 'get',
      url: '/post',
      params: { state: address.state, city: address.city },
    });
  }

  static calcPrice(params = {}) {
    return this.query({
      method: 'get',
      url: '/price',
      params: { total: true, tax: true, products: true, ...params },
    });
  }

  static createTransaction(body) {
    return this.query({ method: 'post', url: '/transaction', data: body });
  }
}
