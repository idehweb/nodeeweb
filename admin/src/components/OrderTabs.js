import React from 'react';
import { useTranslate } from 'react-admin';

export default () => {
  const translate = useTranslate();
  return [
    { id: 'all', name: translate('resources.order.allOrders') },
    { id: 'processing', name: translate('resources.order.processing') },
    { id: 'indoing', name: translate('resources.order.confirmed') },
    { id: 'makingready', name: translate('resources.order.makingready') },
    { id: 'inpeyk', name: translate('resources.order.inpeyk') },
    { id: 'complete', name: translate('resources.order.complete') },
    { id: 'cancel', name: translate('resources.order.canceled') },
  ];
};
