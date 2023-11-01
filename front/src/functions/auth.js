import { ApiUrl } from '.';
import API from './API';

const defaultConfig = { login: true, signup: false };
export class AuthHandler {
  constructor(strategy, config) {
    this.strategy = strategy;
    this.config = Object.assign({}, defaultConfig, config);
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

  detect = (user, opt) => {
    const login = opt?.login !== undefined ? opt.login : this.config.login;
    const signup = opt?.signup !== undefined ? opt.signup : this.config.signup;
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
export const googleHandler = new AuthHandler('google', {
  signup: true,
  login: true,
});
