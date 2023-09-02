import axios from 'axios';
import { ApiUrl } from '.';

export class AuthHandler {
  constructor(strategy) {
    this.strategy = strategy;
  }
  detect = (phone, { login, signup } = { login: true, signup: false }) => {
    return axios.post(`${ApiUrl}/auth/${this.strategy}`, {
      userType: 'customer',
      login,
      signup,
      user: { phone },
    });
  };

  login = (phone, code) => {
    return axios.post(`${ApiUrl}/auth/${this.strategy}/login`, {
      userType: 'customer',
      user: {
        phone,
        code,
      },
    });
  };

  signup = ({ firstName, lastName, phone, code, username }) => {
    return axios.post(`${ApiUrl}/auth/${this.strategy}/signup`, {
      userType: 'customer',
      user: {
        lastName,
        firstName,
        phone,
        code,
        username,
      },
    });
  };
}

const otpHandler = new AuthHandler('otp');

export default otpHandler;
