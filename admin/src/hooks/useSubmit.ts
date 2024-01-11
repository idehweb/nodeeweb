import { useState } from 'react';
import axios, { AxiosError } from 'axios';

import { useNotify, useTranslate } from 'react-admin';

import { BASE_URL } from '@/functions/API';

/**
 * Custom hook for submitting requests.
 *
 * @returns An object containing the data, loading state, error, and a function to send the request.
 */
const useSubmit = () => {
  const [data, setData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<AxiosError>();
  const notify = useNotify();
  const translate = useTranslate();

  /**
   * Sends a request to the server.
   * @param requestQuery - The query string for the request.
   * @param body - The request body.
   * @param method - The HTTP method for the request.
   */
  const sendRequest = async (
    requestQuery: string,
    body: unknown,
    method: string
  ) => {
    setIsLoading(true);
    try {
      const headers = {
        Authorization: 'Bearer ' + (localStorage.getItem('token') || ''),
        // Accept: 'application/json',
        // 'Content-Type': 'application/json',
        // response: 'json',
      };
      const response = await axios.request({
        url: BASE_URL + requestQuery,
        method,
        data: { config: body, restart: false },
        headers,
      });
      setData(response.data);
      setSuccess(true);
      notify(translate('saved successfully.'), {
        type: 'success',
      });
      // Handle successful response
    } catch (error) {
      console.log(error as AxiosError);
      setError(error);
      notify(translate('an error occurred.'), {
        type: 'error',
      });
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, sendRequest, success };
};

export default useSubmit;
