import { useState } from 'react';
import axios, { AxiosError } from 'axios';

import { BASE_URL } from '@/functions/API';

/**
 * Custom hook for uploading an image.
 * @returns An object containing the loading state, progress percentage, error object, uploadImage function, and file data.
 */
const useUploadImage = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<AxiosError>();
  const [fileData, setFileData] = useState<{
    url: string;
    _id: string;
  }>();

  const uploadMedia = async (
    file: File,
    onUploadProgress: (percent: number, canceler: any) => void
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', file.type);

    const headers = {
      Authorization: 'Bearer ' + (localStorage.getItem('token') || ''),
      Accept: 'application/json',
      'Content-Type': 'application/json',
      response: 'json',
    };

    let cancel;
    const config = {
      cancelToken: new axios.CancelToken((c) => {
        cancel = c;
      }),
      onUploadProgress: (ev) => {
        const percent = (ev.loaded / ev.total) * 100;
        onUploadProgress(percent, cancel);
      },
      headers,
    };

    try {
      const res = await axios.post(BASE_URL + '/file', formData, config);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const uploadImage = async (file: File) => {
    setLoading(true);
    setProgress(0);

    if (!file) return;

    try {
      const { data } = await uploadMedia(file, (percent, canceler) => {
        setProgress(percent);
      });

      const { url, _id } = data;
      setFileData({ url, _id });
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, progress, error, uploadImage, fileData };
};

export default useUploadImage;
