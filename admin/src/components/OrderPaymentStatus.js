import React from "react";
import {useTranslate} from 'react-admin';

export default (props) => {
  // const
  return [
    {
      id: 'notpaid',
      name: 'notpaid',
      color: 'warn'

    },
    {
      id: 'unsuccessful',
      name: 'unsuccessful',
      color: 'erro'

    },
    {
      id: 'paid',
      name: 'paid',
      color: 'succ'
    }
  ];
};
