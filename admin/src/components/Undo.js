import React from 'react';
import { Button } from '@mui/material';
import axios from 'axios/index';

import { useParams } from 'react-router';
import { BASE_URL } from '@/functions/API';

export default (props) => {
  const { id } = useParams();

  return (
    <Button
      color="primary"
      size="small"
      onClick={() => {
        const headers = {
          Authorization: 'Bearer ' + (localStorage.getItem('token') || ''),
          Accept: 'application/json',
          'Content-Type': 'application/json',
        };

        const config = {
          headers,
        };

        const data = { id, status: 'undo' };
        axios
          .post(BASE_URL + '/activity', data, config)
          .then((response) => {
            console.log(response);
            // resolve(response);
            // response.json();
          })
          .catch((error) => {
            console.log('error', error);
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
      برگرداندن تغییرات
    </Button>
  );
};
