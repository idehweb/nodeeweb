import React from 'react';
import { useTranslate } from 'react-admin';

export const the_val = () => {
  const translate = useTranslate();
  return [
    {
      value: false,
      label: translate('resources.product.isnt'),
    },
    {
      value: true,
      label: translate('resources.product.is'),
    },
  ];
};
export default () => {
  return the_val();
};
