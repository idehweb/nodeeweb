import axios from 'axios';
import API_Conf, { ApiUrl } from '.';
import { getToken } from './utils';
import { Navigate } from 'react-router-dom';

const API = axios.create({
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

API.interceptors.response.use(
  (data) => {
    return data;
  },
  (err) => {
    if (err.isAxiosError) {
      // unauthorize
      if (
        err.response?.status === 401 &&
        !location.pathname.startsWith('/login') &&
        !err.config?.no_redirect
      ) {
        return (
          <Navigate
            replace={`/login?check=false&redirect=${encodeURIComponent(
              location.pathname,
            )}`}
          />
        );
      }
    }

    throw err;
  },
);

export default API;
