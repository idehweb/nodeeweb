import axios from 'axios';

export const SERVER_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_API_BASE_URL_DEV
    : window.origin;

export const BASE_URL = SERVER_URL + '/api/v1';
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
      headers.Authorization = 'Bearer ' + (localStorage.getItem('token') || '');
      return data;
    },
  ],
});
