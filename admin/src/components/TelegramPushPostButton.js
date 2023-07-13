// in src/comments/telegramPushPostButton.js
import React from 'react';
import { Button } from '@mui/material';
import axios from 'axios/index';

import { BASE_URL } from '@/functions/API';

export default (props) => {
  return (
    <Button
      color="primary"
      size="small"
      onClick={() => {
        console.log('data', props.record._id, BASE_URL);
        let option = {
          headers: {
            lan: 'fa',
          },
        };
        option['headers']['token'] = localStorage.getItem('token');

        axios
          .post(BASE_URL + '/product/telegram/' + props.record._id, {}, option)
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
      ارسال به تلگرام
    </Button>
  );
};
