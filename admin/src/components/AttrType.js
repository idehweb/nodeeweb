import React from "react";
import {
  useTranslate
} from 'react-admin';

export default () => {
  const translate = useTranslate();

  return [
    {
      id: 'normal',
      name: translate('resources.attributes.normal'),
    },
    {
      id: 'color',
      name: translate('resources.attributes.color'),

    }
  ];
};
