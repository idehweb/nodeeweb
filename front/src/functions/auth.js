import { ApiUrl } from '.';
import API from './API';

export class AuthHandler {
  constructor(strategy) {
    this.strategy = strategy;
  }

  async #query(config) {
    const {
      data: { data },
    } = await API({
      method: 'post',
      baseURL: `${ApiUrl}/auth/${this.strategy}`,
      ...config,
    });
    return data;
  }

  detect = (user, { login, signup } = { login: true, signup: false }) => {
    return this.#query({
      url: '/',
      data: {
        userType: 'customer',
        login,
        signup,
        user,
      },
    });
  };

  login = (user) => {
    return this.#query({
      url: `/login`,
      data: {
        userType: 'customer',
        user,
      },
    });
  };

  signup = (user) => {
    return this.#query({
      url: `/signup`,
      data: {
        userType: 'customer',
        user,
      },
    });
  };
}

export const otpHandler = new AuthHandler('otp');
export const jwtHandler = new AuthHandler('jwt');
