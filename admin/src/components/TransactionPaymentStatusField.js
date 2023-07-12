// in src/comments/telegramPushPostButton.js
import React from 'react';
import { Chip } from '@mui/material';

import { useRecordContext, useTranslate } from 'react-admin';

import { BASE_URL } from '@/functions/API';

export default () => {
  const record = useRecordContext();
  const translate = useTranslate();
  // console.log("Chip", record,"source",source);
  if (record)
    return (
      <Chip
        className={record.color}
        label={translate('pos.paymentStatus.' + record.name)}
      />
    );
  else return <></>;
};
