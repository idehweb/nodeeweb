import axios from 'axios';
import { ApiUrl, token } from '.';

export default axios.create({
  baseURL: ApiUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    response: 'json',
  },
  // add Authorization token to header
  transformRequest: [
    (data, headers) => {
      headers.Authorization = token;
      return data;
    },
  ],
});
