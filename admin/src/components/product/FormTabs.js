import React from "react";
import {
  useTranslate
} from "react-admin";

export default () => {
  const translate=useTranslate();
  return [
    {id: 'sell', name: translate("resources.product.sell")},
    {id: 'content', name: translate("resources.product.content")},
    {id: 'analytics', name: translate("resources.product.analytics")},
    {id: 'settings', name: translate("resources.product.settings")}
  ];
};
