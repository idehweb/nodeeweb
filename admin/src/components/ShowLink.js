import React from "react";
import { TextField, useRecordContext, useTranslate } from "react-admin";
import API from "@/functions/API";

API.defaults.headers.common["Content-Type"] = "multipart/form-data";

export default ({ base = "product",theSource="title" }) => {
  const record = useRecordContext();
  const translate = useTranslate();

  return (
    <>
      {(record.path && record.slug) &&
      <a target={"_blank"} href={window.BASE_URL + (base ? (base + "") : "") + record.path + "/"}><TextField
        source={theSource+"." + translate("lan")} label={translate("pos."+theSource)} sortable={false}/></a>}
      {(!record.path &&record.slug) &&
      <a target={"_blank"} href={window.SHOP_URL + (base ? (base + "/") : "") + record.slug + "/"}><TextField
        source={theSource+"." + translate("lan")} label={translate("pos."+theSource)} sortable={false}/></a>}
    </>
  );

};
