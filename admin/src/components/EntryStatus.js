import * as React from "react";
import { useState } from "react";
// import MuiGridList from '@mui/material/GridList';
// import GridListTile from '@mui/material/GridListTile';
// import GridListTileBar from '@mui/material/GridListTileBar';
// import withWidth, { WithWidth } from '@mui/material/withWidth';
import { ShopURL } from "@/functions/API";
import { SubmitEntryStatus } from "@/components";

import { dateFormat } from "@/functions";
import { useDataProvider, useTranslate } from "react-admin";
import { useSelector } from "react-redux";

const EntryStatus = (props) => {
  const { record } = props;
  const { _id, status } = record;
  const [state, setState] = useState({});
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const themeData = useSelector((st) => st.themeData);
  let { orders } = state;
  return <div style={{ padding: "10px" }}>
    <div className={"label-top-table"}><span>{translate("resources.entry.tasks")}</span></div>
        <SubmitEntryStatus _id={_id} theStatus={status}/>
    </div>;
};

export default React.memo(EntryStatus);
