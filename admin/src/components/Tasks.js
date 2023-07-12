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

import { dateFormat } from '@/functions';
import { ShopURL } from '@/functions/API';

const Tasks = (props) => {
  const { record } = props;
  const { _id } = record;
  const [state, setState] = useState({});
  const translate = useTranslate();
  // const version = useVersion();
  const dataProvider = useDataProvider();
  const themeData = useSelector((st) => st.themeData);

  const fetchOrders = useCallback(async () => {
    const { data: Data } = await dataProvider.get(
      'task/0/10000?customer=' + _id,
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
    <div style={{ padding: '10px' }}>
      <div className={'label-top-table'}>
        <span>{translate('tasks')}</span>
        <span>
          <IconButton aria-label="create">
            <AddTaskIcon />
          </IconButton>
        </span>
      </div>
    </div>
  );
};

export default Tasks;
