import React from 'react';
import { Button } from '@mui/material';
import { useTranslate } from 'react-admin';
import axios from 'axios/index';

import { useParams } from 'react-router';
import { BASE_URL } from '@/functions/API';

import { toast } from 'react-toastify';

export default () => {
  const translate = useTranslate();
  const { id } = useParams();

  return (
    <Button
      color="primary"
      size="small"
      onClick={async () => {
        try {
          const headers = {
            Authorization: 'Bearer ' + (localStorage.getItem('token') || ''),
            Accept: 'application/json',
            'Content-Type': 'application/json',
          };

          const config = {
            headers,
          };
          const data = { id, status: 'undo' };
          const response = await axios.post(
            BASE_URL + '/activity',
            data,
            config
          );
          toast.success(translate('resources.action.undoDone'), {
            autoClose: 2000,
          });
        } catch (err) {
          console.log('err', err);
          toast.error('Something went wrong', {
            autoClose: 2000,
          });
        }
      }}>
      {translate('resources.action.undo')}
    </Button>
  );
};
