import React from 'react';
import { Button } from '@mui/material';
import { useTranslate } from 'react-admin';
import axios from 'axios/index';

import { useParams } from 'react-router';
import { BASE_URL } from '@/functions/API';

export default (props) => {
  const translate = useTranslate();
  const { id } = useParams();

  return (
    <Button
      color="primary"
      size="small"
      //   onClick={() => {
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

          console.log(response);
          // response.json()
        } catch (err) {
          console.log('err', err);
        }

        // const headers = {
        //   Authorization: 'Bearer ' + (localStorage.getItem('token') || ''),
        //   Accept: 'application/json',
        //   'Content-Type': 'application/json',
        // };

        // const config = {
        //   headers,
        // };

        // const data = { id, status: 'undo' };
        // axios
        //   .post(BASE_URL + '/activity', data, config)
        //   .then((response) => {
        //     console.log(response);
        //     // response.json();
        //   })
        //   .catch((error) => {
        //     console.log('error', error);
        //   });
      }}>
      {translate('resources.action.undo')}
      {/* برگرداندن تغییرات */}
    </Button>
  );
};
