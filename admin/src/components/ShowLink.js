import React from 'react';
import { TextField, useRecordContext, useTranslate } from 'react-admin';

import API from '@/functions/API';

API.defaults.headers.common['Content-Type'] = 'multipart/form-data';

const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_API_BASE_URL_DEV
    : window.origin;

export default ({ base = 'product', theSource = 'title' }) => {
  const record = useRecordContext();
  const translate = useTranslate();

  return (
    <>
      {record.path && record.slug && (
        <a
          target={'_blank'}
          href={BASE_URL + '/' + (base ? base + '' : '') + record.path + '/'}
          rel="noreferrer">
          <TextField
            source={theSource + '.' + translate('lan')}
            label={translate('pos.' + theSource)}
            sortable={false}
          />
        </a>
      )}
      {!record.path && record.slug && (
        <a
          target={'_blank'}
          href={BASE_URL + '/' + (base ? base + '/' : '') + record.slug + '/'}
          rel="noreferrer">
          <TextField
            source={theSource + '.' + translate('lan')}
            label={translate('pos.' + theSource)}
            sortable={false}
          />
        </a>
      )}
    </>
  );
};
