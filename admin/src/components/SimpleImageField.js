import React from 'react';
import { useRecordContext } from 'react-admin';

import API, { SERVER_URL } from '@/functions/API';
import { ShopURL, BASE_URL } from '@/functions/API';

API.defaults.headers.common['Content-Type'] = 'multipart/form-data';

export default ({}) => {
  const record = useRecordContext();

  return (
    <div className={'thumbnail'}>
      {record.thumbnail && (
        <img
          src={SERVER_URL + record.thumbnail}
          alt=""
          srcSet={SERVER_URL + record.thumbnail}
        />
      )}
    </div>
  );
};
