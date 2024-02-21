import { Button } from '@mui/material';
import axios from 'axios';

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
          .post(BASE_URL + '/campaign/send/' + props.record._id, {}, option)
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
      send campaign
    </Button>
  );
};
