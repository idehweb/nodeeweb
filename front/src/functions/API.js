import axios from 'axios';
import API_Conf, { ApiUrl } from '.';
import { getToken } from './utils';

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
      headers.Authorization = getToken();
      if (typeof data === 'object') data = JSON.stringify(data);
      return data;
    },
  ],
});
