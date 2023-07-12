import React from 'react';
import { useTranslate } from 'react-admin';

export default () => {
  const translate = useTranslate();

  return [
    {
      id: 'normal',
      name: translate('resources.product.normal'),
    },
    {
      id: 'variable',
      name: translate('resources.product.variable'),
    },
  ];
};
