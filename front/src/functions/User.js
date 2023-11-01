import { ApiUrl } from '.';
import API from './API';
import store from './store';

export default class UserService {
  static async query(config) {
    const user = this.getMeLocal();
    let type = user.type || user.role?.split(':')?.[0] || 'customer';
    if (type === 'user') type = 'customer';
    const response = await API({
      baseURL: `${ApiUrl}/${type}`,
      url: '/',
      ...config,
    });
    return response?.data?.data;
  }

  static getMeLocal(def = {}) {
    return store.getState().store.user ?? {};
  }
  static getMe() {
    return this.query({ method: 'get', url: '/me' });
  }

  static async update(body, config = {}) {
    return this.query({
      method: 'put',
      url: '/me',
      data: body,
      ...config,
    });
  }
}
