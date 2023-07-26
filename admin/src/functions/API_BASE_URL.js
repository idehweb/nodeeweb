import axios from 'axios';

export const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_API_BASE_URL_DEV
    : window.origin;
export const ADMIN_ROUTE = BASE_URL + '/admin';
export const ShopURL = BASE_URL;

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    response: 'json',
  },
  // add Authorization token to header
  transformRequest: [
    (data, headers) => {
      headers.token = localStorage.getItem('token') || '';
      return data;
    },
  ],
});
