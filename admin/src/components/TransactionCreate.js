// in src/comments/telegramPushPostButton.js
import React from 'react';
import { Button } from '@mui/material';
import axios from 'axios/index';

import { useTranslate } from 'react-admin';

import { BASE_URL } from '@/functions/API';

export default (props) => {
  let { record } = props;
  const translate = useTranslate();
  return (
    <Button
      color="primary"
      size="small"
      onClick={() => {
        console.log('data', record, BASE_URL);
        let option = {
          headers: {
            lan: 'fa',
          },
        };
        option['headers']['token'] = localStorage.getItem('token');

        axios
          .post(BASE_URL + '/admin/order/createPaymentLink/', {}, option)
          .then(function (response) {
            // console.log('fetched!');
            // resolve(response);
            // response.json();
          })
          .catch(function (error) {
            // console.log(error);
            // reject(error);
          });
        // fetch(`/comments/${data.id}`, { method: 'POST'})
        //     .then(() => {
        //         // showNotification('Comment approved');
        //         // push('/comments');
        //     })
        //     .catch((e) => {
        //         console.error(e);
        //         // showNotification('Error: comment not approved', 'warning')
        //     });
      }}>
      {translate('createTransaction')}
    </Button>
  );
};
