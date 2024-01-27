import { useState, useEffect, useCallback } from 'react';

import API from '@/functions/API';

// import { ApiUrl } from '@/functions';
// import { getToken } from '@/functions/utils';

/**
 * Custom hook for fetching data from an API.
 *
 * @param {string} requestQuery - The API endpoint to fetch data from.
 * @param {object} params - Optional parameters to be sent with the request.
 * @returns {object} - An object containing the fetched data, loading state, error, and a refetch function.
 */
const useFetch = ({ requestQuery }: { requestQuery: string }) => {
  // State variables to store the fetched data, loading state, and error

  const [data, setData] = useState<unknown>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log('use fetch is called ! tracecode#2352');

  // Function to fetch data from the API
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Send a GET request to the API endpoint with the headers and optional parameters
      const response = await API.get(requestQuery);
      // Set the fetched data and update the loading state
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      // Set the error and update the loading state in case of an error
      setError(error);
      setIsLoading(false);
    }
  }, [requestQuery]);

  // Fetch data when the component mounts and handle any errors
  useEffect(() => {
    let isMounted = true;

    fetchData().catch((error) => {
      if (isMounted) {
        setError(error);
        setIsLoading(false);
      }
    });

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  // Function to refetch the data
  const refetch = useCallback(() => {
    setIsLoading(true);
    fetchData();
  }, [fetchData]);

  // Return the fetched data, loading state, error, and refetch function as an object
  return { data, isLoading, error, refetch };
};

export default useFetch;
