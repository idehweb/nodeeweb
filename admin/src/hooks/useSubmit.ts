import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

import { BASE_URL } from '@/functions/API';

const useSubmit = (requestQuery: String, body: object) => {
  console.log('use submit is called');
  const [data, setData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AxiosError>();
  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const headers = {
          Authorization: 'Bearer ' + (localStorage.getItem('token') || ''),
          Accept: 'application/json',
          'Content-Type': 'application/json',
          response: 'json',
        };
        const Response = await axios.put(
          BASE_URL + requestQuery,
          headers,
          body
        );
        setData(Response.data);
        // Handle successful response
      } catch (error) {
        console.log(error as AxiosError);
        setError(error);
        // Handle error
      } finally {
        setIsLoading(false);
      }
    };

    sendRequest();
  }, [requestQuery, body]);
  return { data, isLoading, error };
};

export default useSubmit;
