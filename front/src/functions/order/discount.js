import { ApiUrl } from '..';
import API from '../API';

export class DiscountService {
  static async query(config) {
    const response = await API({
      baseURL: `${ApiUrl}/discount`,
      url: '/',
      ...config,
    });
    return response?.data?.data;
  }

  static get(code) {
    return this.query({ method: 'get', url: `/${code}` });
  }
}
