// in src/comments/telegramPushPostButton.js
import React from "react";
import { Chip } from "@mui/material";
import { BASE_URL } from "@/functions/API";
import { useRecordContext,useTranslate } from 'react-admin';

export default ({source}) => {
  const record = useRecordContext();
  const translate = useTranslate();
  // console.log("Chip", record,"source",source);
  if (record)
    return <Chip className={record.color} label={translate("pos.OrderStatus."+record.name)}></Chip>;
  else
    return <></>;
}
