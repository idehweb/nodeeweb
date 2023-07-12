// in src/comments/telegramPushPostButton.js
import React from 'react';
import { useTranslate, useNotify } from 'react-admin';
import { Button } from '@mui/material';
import axios from 'axios/index';

import { BASE_URL } from '@/functions/API';

export default (props) => {
  let translate = useTranslate();
  let notify = useNotify();
  return (
    <Button
      color="primary"
      size="small"
      onClick={() => {
        console.log('data', BASE_URL);
        let option = {
          headers: {
            lan: 'fa',
          },
        };
        option['headers']['token'] = localStorage.getItem('token');

        axios
          .post(BASE_URL + '/admin/product/rewriteProducts/', {}, option)
          .then(function (response) {
            // console.log('fetched!');
            // resolve(response);
            notify(translate('rewritten successfully.'), {
              type: 'success',
            });
            // response.json();
          })
          .catch(function (error) {
            // alert('error')
            notify(translate('rewrite failed.'), {
              type: 'error',
            });
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
      {translate('rewrite')}
    </Button>
  );
};
