import * as React from 'react';
import { useState } from 'react';

// import MuiGridList from '@mui/material/GridList';
// import GridListTile from '@mui/material/GridListTile';
// import GridListTileBar from '@mui/material/GridListTileBar';
// import withWidth, { WithWidth } from '@mui/material/withWidth';
import { useDataProvider, useTranslate } from 'react-admin';

import { useSelector } from 'react-redux';

import { ShopURL } from '@/functions/API';
import { SubmitCustomerStatus } from '@/components';

import { dateFormat } from '@/functions';

const CustomerStatus = (props) => {
  const { record } = props;
  console.log('custoooooooooooooomer', record);
  const { _id, status } = record;
  const [state, setState] = useState({});
  const translate = useTranslate();
  // const version = useVersion();
  const dataProvider = useDataProvider();
  const themeData = useSelector((st) => st.themeData);

  // const fetchOrders = useCallback(async () => {
  //   const { data: Data } = await dataProvider.get(
  //     "customer/status/0/10000?customer=" + _id,
  //     {}
  //   );
  //   console.log("Data", Data);
  //
  //
  //   setState(state => ({
  //     ...state,
  //     orders: Data
  //
  //   }));
  //
  // }, [dataProvider]);
  // useEffect(() => {
  //   fetchOrders();
  // }, []);
  let { orders } = state;
  // const { data,isLoading } = useListContext();
  // let loaded = Boolean(data && data.length);
  // console.log("loaded", loaded,isLoading);
  // let objs=Object.keys(orders);
  // const columns = [
  //   { field: "_id", headerName: "ID" },
  //   { field: "orderNumber", headerName: "orderNumber", type: "number" },
  //   {
  //     field: "amount",
  //     headerName: "Amount",
  //     type: "number"
  //   },
  //   {
  //     field: "sum",
  //     headerName: "Sum",
  //     type: "number"
  //   },
  //   {
  //     field: "paymentStatus",
  //     headerName: "paymentStatus"
  //   },
  //   {
  //     field: "status",
  //     headerName: "status"
  //   }
  //   ,
  //   {
  //     field: "createdAt",
  //     headerName: "createdAt"
  //   },
  //   {
  //     field: "updatedAt",
  //     headerName: "updatedAt"
  //   }
  // ];
  // if (!orders) {
  //   return <></>;
  // }
  // return  <div style={{ height: 400, width: '100%' }}><DataGrid
  //   getRowId={(row) => row._id}
  //   rows={orders}
  //   columns={columns}
  //   pageSize={20}
  //   rowsPerPageOptions={[5, 20, 100]}
  // /></div>;
  return (
    <div style={{ padding: '10px' }}>
      <div className={'label-top-table'}>
        <span>{translate('customerStatus')}</span>
      </div>
      {/*{JSON.stringify(status)}*/}
      <SubmitCustomerStatus _id={_id} theStatus={status} />
    </div>
  );
};

export default CustomerStatus;
