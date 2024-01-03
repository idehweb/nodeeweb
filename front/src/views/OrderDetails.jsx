import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Row } from 'shards-react';
import { withTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import PageTitle from '#c/components/common/PageTitle';
import { getMyOrder } from '#c/functions/index';
import { store } from '#c/functions/store';

import { dateFormat } from '#c/functions/utils';

const OrderDetails = ({ t }) => {
  let params = useParams();
  let { _id } = params;
  let [dat, setDat] = useState({});
  let [card, setCard] = useState([]);
  let [lan, setLan] = useState(store.getState().store.lan || 'fa');
  const [loading, setLoading] = useState(false);

  let [headCells, setHeadCells] = useState([
    {
      id: 'title',
      numeric: false,
      disablePadding: true,
      label: t('title'),
    },
    {
      id: 'count',
      numeric: false,
      disablePadding: true,
      label: t('count'),
    },
    {
      id: 'price',
      numeric: false,
      disablePadding: true,
      label: t('price'),
    },
  ]);
  const getMyOrdersF = (_id) => {
    setLoading(true);
    getMyOrder(_id).then((post) => {
      if (!post || !post.data) return null;
      if (post.data && post.data.createdAt)
        post.data.createdAt = dateFormat(post.data.createdAt);
      if (post.data && post.data.updatedAt)
        post.data.updatedAt = dateFormat(post.data.updatedAt);
      if (post.data && post.data['totalPrice']) {
        post.data['totalPrice'] =
          post.data['totalPrice']
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + t(' UZS');

        if (post && post.data['amount']) {
          post['amount'] =
            post['amount'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
            t(' UZS');
        }
        if (post && post.data.post['price']) {
          post.data.post['price'] =
            post.data.post['price']
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + t(' UZS');
        }
        // link['kind'] = t('product');
      }
      if (post.data && post.data['status']) {
        switch (post.data['status']) {
          case 'processing':
            post.data['status'] = t('waiting to review');
            post.data['status_cl'] =
              'bg-warning text-white text-center rounded p-3 iii';
            break;
          case 'published':
            post.data['status'] = t('confirmed');
            post.data['status_cl'] =
              'bg-success text-white text-center rounded p-3 iii';
            break;
          case 'complete':
            post.data['status'] = t('complete');
            post.data['status_cl'] =
              'bg-success text-white text-center rounded p-3 iii';
            break;
          case 'indoing':
            post.data['status'] = t('indoing');
            post.data['status_cl'] =
              'bg-warning text-white text-center rounded p-3 iii';
            break;
          case 'makingready':
            post.data['status'] = t('makingready');
            post.data['status_cl'] =
              'bg-warning text-white text-center rounded p-3 iii';
            break;
          case 'canceled':
            post.data['status'] = t('canceled');
            post.data['status_cl'] =
              'bg-error text-white text-center rounded p-3 iii';
            break;
          case 'deleted':
            post.data['status'] = t('deleted');
            post.data['status_cl'] =
              'bg-error text-white text-center rounded p-3 iii';
            break;
          case 'inpeyk':
            post.data['status'] = t('inpeyk');
            post.data['status_cl'] =
              'bg-warning text-white text-center rounded p-3 iii';
            break;
          case 'checkout':
            post.data['status'] = t('checkout');
            post.data['status_cl'] =
              'bg-warning text-white text-center rounded p-3 iii';
            break;
          case 'cart':
            post.data['status'] = t('cart');
            post.data['status_cl'] =
              'bg-warning text-white text-center rounded p-3 iii';
            break;
          default:
            break;
        }
      }
      if (post.data && post.data['paymentStatus']) {
        switch (post.data['paymentStatus']) {
          case 'paid':
            post.data['paymentStatus'] = t('successful');
            post.data['paymentStatus_cl'] =
              'bg-success text-white text-center rounded p-3 iii';
            break;
          case 'notpaid':
            post.data['paymentStatus'] = t('not paid');
            post.data['paymentStatus_cl'] =
              'bg-warning text-white text-center rounded p-3 iii';
            break;
          case 'unsuccessful':
            post.data['paymentStatus'] = t('unsuccessful');
            post.data['paymentStatus_cl'] =
              'bg-error text-white text-center rounded p-3 iii';
            break;
          default:
            break;
        }
      }
      post.data &&
        post.data.products.forEach((item, key) => {
          post.data.products[key]['id'] = item._id;
          post.data.products[key]['title'] = item.title[lan];
          if (item.price)
            post.data.products[key]['price'] =
              item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
              t(' UZS');
          if (item.salePrice)
            post.data.products[key]['salePrice'] =
              item.salePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
              t(' UZS');
        });
      setCard(post.data.products);
      setDat({ ...dat.data, ...post.data });
      return 0;
    });
  };
  useEffect(() => {
    getMyOrdersF(_id);
  }, []);
  // const columns = [
  //   { field: '_id', headerName: t('ID'), hide: true },
  //   { field: 'title', headerName: t('title'), flex: 1, sortable: false },
  //   { field: 'quantity', headerName: t('count'), sortable: false, width: 80 },
  //   { field: 'price', headerName: t('price'), sortable: false, width: 120 },
  //   {
  //     field: 'salePrice',
  //     headerName: t('salePrice'),
  //     sortable: false,
  //     width: 120,
  //   },
  // ];

  // const combinationsColumns = [
  //   { field: '_id', headerName: t('ID'), hide: true },
  //   { field: 'price', headerName: t('price'), flex: 1, sortable: false },
  //   {
  //     field: 'quantity',
  //     headerName: t('quantity'),
  //     sortable: false,
  //     width: 80,
  //   },
  //   {
  //     field: 'salePrice',
  //     headerName: t('salePrice'),
  //     sortable: false,
  //     width: 120,
  //   },
  // ];

  // const renderOrderedProducts = card.map((item, key) => (
  //   <div key={item._id}></div>
  // ));

  const renderCombinationsTable = (combinations) => {
    return (
      <table
        style={{
          borderCollapse: 'collapse',
          width: '100%',
        }}>
        <thead>
          <tr
            style={{
              backgroundColor: '#f5f5f5',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <th style={tableHeaderStyle}>{t('price')}</th>
            <th style={tableHeaderStyle}>{t('quantity')}</th>
            <th style={tableHeaderStyle}>{t('salePrice')}</th>
          </tr>
        </thead>
        <tbody>
          {combinations.map((combination) => (
            <div key={combination._id}>
              <tr
                key={combination._id}
                style={{
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderWidth: '2px',
                  borderColor: 'gray',
                  borderRadius: '0.5rem',
                  marginTop: '1rem',
                }}>
                <td style={tableCellStyle}>
                  {combination.price.toLocaleString()} {t(dat.currency)}
                </td>
                <td style={tableCellStyle}>{combination.quantity}</td>
                <td style={tableCellStyle}>
                  {combination.salePrice
                    ? combination.salePrice.toLocaleString()
                    : combination.price.toLocaleString()}{' '}
                  {t(dat.currency)}
                </td>
              </tr>
              {combination.options
                ? Object.entries(combination.options).map(([key, value]) => {
                    if (key !== '_id') {
                      return (
                        <div
                          key={key}
                          style={{
                            backgroundColor: 'whitesmoke',
                            color: 'GrayText',
                            padding: '8px',
                            borderRadius: '0.5rem',
                            margin: '1rem',
                          }}>
                          {`${key} : ${value}`}
                        </div>
                      );
                    }
                    return null;
                  })
                : null}
              {/* render an attribute called options which is in combination */}
            </div>
          ))}
        </tbody>
      </table>
    );
  };

  const tableHeaderStyle = {
    padding: '12px',
    textAlign: 'center',
    fontWeight: 'bold',
  };

  const tableCellStyle = {
    textAlign: 'center',
    padding: '12px',
  };

  return dat && dat.post ? (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="12"
          title={t('My order details')}
          subtitle={t('user account')}
          className="text-sm-left"
        />
      </Row>

      {/* Default Light Table */}
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardBody className="p-2 pb-3">
              <Row>
                <Col lg={12} md={12} sm={12} xs={12}>
                  <div className={'the-order mb-3'}>
                    <div className={'the-order-purple p-4'}>
                      <div className={'the-order-title'}>
                        <div className={'the-order-number'}>
                          <div>{t('Order #') + dat._id}</div>
                          <div className={'mb-2'}>
                            {' '}
                            {t('Order Date')}:{dateFormat(dat.updatedAt)}
                          </div>
                        </div>
                        <div className={'the-order-status '}>
                          <div className={'mb-2'}>
                            <span>{t('Order Status') + ':'}</span>
                            <span className={dat.status_cl}>
                              <span className={'gfdsdf'}>{t(dat.status)}</span>
                            </span>
                          </div>
                          {/* <div>
                        <span>{t('Payment Status') + ':'}</span>
                        <span className={dat.paymentStatus_cl}>
                          <span className={'gfdsdf'}>
                            {dat.paymentStatus}
                          </span>
                        </span>
                      </div> */}
                        </div>
                      </div>

                      <div className={'the-order-body'}>
                        <table className={'width100darsad'}>
                          <tbody>
                            <tr>
                              <td>
                                {/* <div className={'the-order-body-line'}>
                                {t('Order Status')} : {t(dat.status)}
                              </div> */}
                                <div className={'the-order-body-line'}>
                                  {t('Delivery Time')} : {dat.post.description}
                                </div>
                                <div className={'the-order-body-line'}>
                                  {t('Delivery Price')} :{' '}
                                  {dat.post.price.toLocaleString()}
                                </div>
                                {dat.totalPrice && (
                                  <div className={'the-order-body-line'}>
                                    {t('Total Price')} : {dat.totalPrice}
                                  </div>
                                )}
                              </td>
                              {/* <td>
                            {dat.post.description && (
                              <div className={'the-order-body-line'}>
                                {t('Delivery Time')}:{dat.post.description}
                              </div>
                            )}
                            {dat.billingAddress && (
                              <div className={'the-order-body-line'}>
                                {t('Address')}:
                                {dat.billingAddress.StreetAddress}
                              </div>
                            )}
                          </td> */}
                            </tr>
                          </tbody>
                        </table>
                        {/* <div className={'the-order-number'}></div>
                    <div className={'the-order-status '}></div>

                    <div className={'clear'}></div> */}
                      </div>
                      {/* <div className={'the-order-body-table'}>
                    <div style={{ display: 'flex', height: '100%' }}>
                      <div style={{ flexGrow: 1 }}>
                        {Boolean(
                          dat.transaction && dat.transaction.length > 0
                        ) && (
                          <div className={'mt-3'}>
                            <div className={'the-header bold mb-2'}>
                              {t('transaction list') + ':'}
                            </div>
                            <div
                              className={'flex-box row border-bottom-1px'}>
                              <div
                                className={'flex-item col-md-4 bold sz-14'}>
                                {t('transaction authority')}
                              </div>
                              <div
                                className={'flex-item col-md-4 bold sz-14'}>
                                {t('amount')}
                              </div>
                              <div
                                className={'flex-item col-md-4 bold sz-14'}>
                                {t('status code')}
                              </div>
                            </div>
                            {dat.transaction.map((tt, xx) => {
                              return (
                                <div
                                  className={
                                    'flex-box row border-bottom-1px'
                                  }
                                  key={xx}>
                                  <div className={'hidden d-none'}>
                                    {tt._id}
                                  </div>
                                  <div
                                    className={'flex-item col-md-4 sz-13'}>
                                    {tt.Authority}
                                  </div>
                                  <div
                                    className={'flex-item col-md-4 sz-13'}>
                                    {tt.amount
                                      .toString()
                                      .replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ','
                                      ) + t('Rial')}
                                  </div>
                                  <div
                                    className={'flex-item col-md-4 sz-13'}>
                                    {tt.statusCode}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div> */}
                      <div className={'the-order-body-table'}>
                        <div style={{ display: 'flex', height: '100%' }}>
                          <div style={{ flexGrow: 1 }}>
                            {Boolean(card && card.length > 0) && (
                              <>
                                {/* {renderOrderedProducts} */}
                                {/* <DataGrid
                                rows={card}
                                disableColumnFilter={true}
                                disableColumnMenu={true}
                                columns={columns}
                                columnBuffer={8}
                                hideFooterPagination={true}
                                hideFooter={true}
                                disableVirtualization
                                autoHeight={true}
                              /> */}

                                {card.map((item) => (
                                  <div
                                    key={item._id}
                                    style={{
                                      padding: '0.5rem',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'space-between',
                                      marginTop: '1rem',
                                    }}>
                                    <hr />
                                    <p>{item.title}</p>
                                    {renderCombinationsTable(item.combinations)}
                                  </div>
                                ))}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  ) : (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      سفارش نهایی نشده است
    </div>
  );
  // }
};

export default withTranslation()(OrderDetails);
