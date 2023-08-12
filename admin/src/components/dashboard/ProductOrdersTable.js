import * as React from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useGetList, useTranslate } from 'react-admin';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Block } from 'notiflix/build/notiflix-block-aio';

import API from '@/functions/API';

const ProductOrdersTable = (props) => {
  const translate = useTranslate();
  const [orders, setOrders] = React.useState([]);
  let resultProducts = [];
  const getData = async () => {
    Block.circle('.' + props.model);
    await API.get('/order/0/1000?_order=DESC').then(({ data = {} }) => {
      setOrders(data);
      Block.remove('.' + props.model);
    });
  };
  if (orders.length > 0) {
    let productList = [];
    orders.forEach((order, index) => {
      if (order.card) {
        order.card.forEach((product) => {
          productList.push(product);
        });
      }
    });
    let ProductListNew = [];
    productList.forEach((product) => {
      ProductListNew.push({
        id: product._id,
        title: product.title.fa,
        price: product.price,
        salePrice: product.salePrice,
        count: product.count,
      });
    });
    let newsPro = [{ id: '' }];
    for (let i = 0; i <= ProductListNew.length - 1; i++) {
      let checkID = newsPro.findIndex((pr) => pr.id == ProductListNew[i].id);
      if (checkID === -1) {
        newsPro.push(ProductListNew[i]);
      } else {
        newsPro[checkID].count += ProductListNew[i].count;
      }
    }
    resultProducts = newsPro.sort((a, b) => b.count - a.count).slice(1, 21);
  }
  React.useEffect(() => {
    getData();
  }, []);
  return (
    <Card className={'width1000'} style={{ marginTop: '20px' }}>
      <CardHeader title={translate(props.title)} />
      <CardContent>
        <div style={{ height: 'auto' }} className={'order-chart'}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>محصول</TableCell>
                  <TableCell align="right">قیمت</TableCell>
                  <TableCell align="right">تعداد فروش</TableCell>
                  {/*<TableCell align="right">Carbs&nbsp;(g)</TableCell>*/}
                  {/*<TableCell align="right">Protein&nbsp;(g)</TableCell>*/}
                </TableRow>
              </TableHead>
              <TableBody>
                {resultProducts.length > 0 &&
                  resultProducts.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}>
                      <TableCell component="th" scope="row">
                        {row.title}
                      </TableCell>
                      <TableCell align="right">
                        {row.price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </TableCell>
                      <TableCell align="right">{row.count}</TableCell>
                      {/*<TableCell align="right">{row.carbs}</TableCell>*/}
                      {/*<TableCell align="right">{row.protein}</TableCell>*/}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  link: {
    borderRadius: 0,
  },
  linkContent: {
    color: theme.palette.primary.main,
  },
}));

export default React.memo(ProductOrdersTable);
