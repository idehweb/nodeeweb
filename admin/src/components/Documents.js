import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

// import MuiGridList from '@mui/material/GridList';
// import GridListTile from '@mui/material/GridListTile';
// import GridListTileBar from '@mui/material/GridListTileBar';
// import withWidth, { WithWidth } from '@mui/material/withWidth';
import { useDataProvider, useTranslate } from 'react-admin';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Chip } from '@mui/material';
import { useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import AddTaskIcon from '@mui/icons-material/AddTask';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

import { dateFormat } from '@/functions';
import { ShopURL } from '@/functions/API';

const Documents = (props) => {
  const { record } = props;
  const { _id } = record;
  const [state, setState] = useState({});
  const translate = useTranslate();
  // const version = useVersion();
  const dataProvider = useDataProvider();
  const themeData = useSelector((st) => st.themeData);

  const fetchOrders = useCallback(async () => {
    const { data: Data } = await dataProvider.get(
      'document/0/10000?customer=' + _id,
      {}
    );
    console.log('Data', Data);

    setState((state) => ({
      ...state,
      orders: Data,
    }));
  }, [dataProvider]);
  useEffect(() => {
    fetchOrders();
  }, []);
  let { orders } = state;
  // const { data,isLoading } = useListContext();
  // let loaded = Boolean(data && data.length);
  // console.log("loaded", loaded,isLoading);
  // let objs=Object.keys(orders);
  const columns = [
    { field: '_id', headerName: 'ID' },
    { field: 'orderNumber', headerName: 'orderNumber', type: 'number' },
    {
      field: 'amount',
      headerName: 'Amount',
      type: 'number',
    },
    {
      field: 'sum',
      headerName: 'Sum',
      type: 'number',
    },
    {
      field: 'paymentStatus',
      headerName: 'paymentStatus',
    },
    {
      field: 'status',
      headerName: 'status',
    },
    {
      field: 'createdAt',
      headerName: 'createdAt',
    },
    {
      field: 'updatedAt',
      headerName: 'updatedAt',
    },
  ];
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
    <TableContainer component={Paper} style={{ padding: '10px' }}>
      <div className={'label-top-table'}>
        <span>{translate('documents')}</span>
        <span>
          <IconButton aria-label="create">
            <CreateNewFolderIcon />
          </IconButton>
        </span>
      </div>
      <Table
        sx={{ minWidth: '100%', marginBottom: '20px' }}
        aria-label="Documents">
        <TableHead>
          <TableRow>
            <TableCell align="right">
              {translate('resources.document.title')}
            </TableCell>
            <TableCell align="right">
              {translate('resources.document.type')}
            </TableCell>
            {/*<TableCell align="right">{translate("resources.document.updatedAt")}</TableCell>*/}
            {/*<TableCell align="right">{translate("resources.document.createdAt")}</TableCell>*/}
          </TableRow>
        </TableHead>
        <TableBody>
          {orders &&
            orders.map((item, i) => {
              return (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {JSON.stringify(item.title)}
                  </TableCell>
                  <TableCell>{item.type}</TableCell>
                  {/*<TableCell>{(item.amount && item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))+" "+translate(themeData.currency)}</TableCell>*/}
                  {/*<TableCell><a href={"/admin/#/order/" + item._id}>{(item.orderNumber)}</a></TableCell>*/}
                  {/*<TableCell><Chip source="status" className={item.status}*/}
                  {/*label={translate("pos.OrderStatus." + item.status)}/>*/}
                  {/*</TableCell>*/}
                  {/*<TableCell><Chip source="paymentStatus" className={item.paymentStatus}*/}
                  {/*label={translate("pos.OrderPaymentStatus." + item.paymentStatus)}/>*/}
                  {/*</TableCell>*/}
                  {/*<TableCell>{dateFormat(item.updatedAt)}</TableCell>*/}
                  {/*<TableCell>{dateFormat(item.createdAt)}</TableCell>*/}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Documents;
