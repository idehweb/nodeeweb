import axios from 'axios';

export const BASE_URL = window.BASE_URL;
export const ADMIN_ROUTE = window.ADMIN_ROUTE;
export const ShopURL = window.SHOP_URL;

export default axios.create({
  baseURL: ADMIN_ROUTE,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'response': 'json',
  },
  // add Authorization token to header
  transformRequest: [
    (data, headers) => {
      headers.token = localStorage.getItem('token') || '';
      return data;
    },
  ],
});
