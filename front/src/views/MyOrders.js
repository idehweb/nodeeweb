import React from 'react';
import {Card, CardBody, Col, Container, Row} from 'shards-react';
import { Link } from "react-router-dom";
import {withTranslation} from 'react-i18next';

import PageTitle from '#c/components/common/PageTitle';
import {getMyOrders} from '#c/functions/index';

import {dateFormat} from '#c/functions/utils';

class MyOrders extends React.Component {
  constructor(props) {
    super(props);
    let ref = this;
    const {t} = props;
    this.state = {
      data: [],
      redirect: false,
      newText: 'You did not created an order until now! please create one...',
      buttonText: 'create order',
      headCells: [
        {
          id: 'orderNumber',
          numeric: false,
          disablePadding: true,
          label: t('order number'),
        },
        {id: 'sum', numeric: false, disablePadding: true, label: t('sum')},
        {
          id: 'status',
          numeric: false,
          disablePadding: true,
          label: t('status'),
        },
        {
          id: 'paymentStatus',
          numeric: false,
          disablePadding: true,
          label: t('payment status'),
        },

        // {id: 'views', numeric: false, disablePadding: true, label: t('Views count')},
        // {id: 'getContactData', numeric: false, disablePadding: true, label: t('click count')},
        {
          id: 'createdAt',
          numeric: false,
          disablePadding: true,
          label: t('created at'),
        },
        {
          id: 'updatedAt',
          numeric: false,
          disablePadding: true,
          label: t('updated at'),
        },
        {
          id: 'actions',
          button_text: t('view order'),
          numeric: false,
          disablePadding: true,
          label: t('actions'),
          edit: true,
          editAction: function (_id) {
            ref.redirectTrue(_id);
          }
        },
      ],
    };
    this.getMyOrdersF();
  }

  redirectTrue(_id) {
    // getMyPost(_id).then((data) => {
    //   savePost(data);
    this.props.history.push('/order/' + _id);
    // this.setState({
    //   redirect: true
    // })
    // });
  }

  getMyOrdersF() {
    const {t} = this.props;
    getMyOrders().then((data) => {
      if (data && data.length > 0)
        data.map((post) => {
          if (post.createdAt) post.createdAt = dateFormat(post.createdAt);

          if (post.updatedAt) post.updatedAt = dateFormat(post.updatedAt);
          if (post && post['sum']) {
            post['sum'] =
              post['sum'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + t(' UZS');

            if (post && post['amount']) {
              post['amount'] =
                post['amount'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + t(' UZS');
            }
            if (post && post['deliveryPrice']) {
              post['deliveryPrice'] =
                post['deliveryPrice'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + t(' UZS');
            }
            // link['kind']=t('product');
          }
          if (post && post['status']) {
            switch (post['status']) {
              case 'processing':
                post['status'] = t('waiting to review');
                post['status_cl'] =
                  'bg-warning text-white text-center rounded p-3 iii';
                break;
              case 'published':
                post['status'] = t('confirmed');
                post['status_cl'] =
                  'bg-success text-white text-center rounded p-3 iii';
                break;
              case 'complete':
                post['status'] = t('complete');
                post['status_cl'] =
                  'bg-success text-white text-center rounded p-3 iii';
                break;
              case 'indoing':
                post['status'] = t('indoing');
                post['status_cl'] =
                  'bg-warning text-white text-center rounded p-3 iii';
                break;
              case 'makingready':
                post['status'] = t('makingready');
                post['status_cl'] =
                  'bg-warning text-white text-center rounded p-3 iii';
                break;
              case 'canceled':
                post['status'] = t('canceled');
                post['status_cl'] =
                  'bg-error text-white text-center rounded p-3 iii';
                break;
              case 'deleted':
                post['status'] = t('deleted');
                post['status_cl'] =
                  'bg-error text-white text-center rounded p-3 iii';
                break;
              case 'inpeyk':
                post['status'] = t('inpeyk');
                post['status_cl'] =
                  'bg-warning text-white text-center rounded p-3 iii';
                break;
              case 'checkout':
                post['status'] = t('checkout');
                post['status_cl'] =
                  'bg-warning text-white text-center rounded p-3 iii';
                break;
              case 'cart':
                post['status'] = t('cart');
                post['status_cl'] =
                  'bg-warning text-white text-center rounded p-3 iii';
                break;
              default:
                break;
            }
          }
          if (post && post['paymentStatus']) {
            switch (post['paymentStatus']) {
              case 'paid':
                post['paymentStatus'] = t('successful');
                post['paymentStatus_cl'] =
                  'bg-success text-white text-center rounded p-3 iii';
                break;
              case 'notpaid':
                post['paymentStatus'] = t('not paid');
                post['paymentStatus_cl'] =
                  'bg-warning text-white text-center rounded p-3 iii';
                break;
              case 'unsuccessful':
                post['paymentStatus'] = t('unsuccessful');
                post['paymentStatus_cl'] =
                  'bg-error text-white text-center rounded p-3 iii';
                break;
              default:
                break;
            }
          }

          return 0;
        });
      this.setState({
        data: data,
      });
    });
  }

  render() {
    let {t} = this.props;
    let {data, headCells, newText, buttonText} = this.state;
    // if (redirect) {
    //   return <Navigate to='/add-new-post'/>;
    // } else {
    return (
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="12"
            title={t('my orders')}
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

                  {data && data.map((dat, i) => {
                    return (<Col lg={4} md={4} sm={6} xs={12}>
                      <div className={'the-order mb-3'}>
                        <div className={'the-order-purple p-4'}>
                          <div className={'the-order-title'}>
                            <div className={'the-order-number'}> {t('Order #') + dat.orderNumber}</div>
                            <div className={'the-order-status '}><Link
                              className={'gfdsdf'} to={'/order-details/'+dat._id}>{t("view items")}</Link></div>
                          </div>
                          <div className={'the-order-body'}>
                            <div className={'the-order-body-line'}>
                              {t('Order Date')}
                              :
                              {dat.updatedAt}
                            </div>
                            <div className={'the-order-body-line'}>
                              {t('Order Status')}
                              :
                              <span className={dat.status_cl}><span
                                className={'gfdsdf'}>{t(dat.status)}</span></span>
                            </div>
                            <div className={'the-order-body-line'}>
                              {t('Payment Status')}
                              :
                              <span className={dat.paymentStatus_cl}> {dat.paymentStatus}</span>
                            </div>
                            <div className={'the-order-body-line'}>
                              {t('Card Price')}
                              :
                              {dat.sum}
                            </div>
                            <div className={'the-order-body-line'}>
                              {t('Delivery Price')}
                              :
                              {dat.deliveryPrice}
                            </div>
                            <div className={'the-order-body-line'}>
                              {t('Total Price')}
                              :
                              {dat.amount}
                            </div>
                            {dat.deliveryDay && dat.deliveryDay.description && <div className={'the-order-body-line'}>
                              {t('Delivery Time')}
                              :
                              {dat.deliveryDay.description}
                            </div>}
                            {dat.billingAddress && <div className={'the-order-body-line'}>
                              {t('Address')}
                              :
                              {dat.billingAddress.StreetAddress}
                            </div>}
                          </div>
                        </div>
                      </div>
                    </Col>)
                  })}
                </Row>
                {/*<Table*/}
                {/*data={data}*/}
                {/*headCells={headCells}*/}
                {/*newText={newText}*/}
                {/*buttonText={buttonText}*/}
                {/*/>*/}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
    // }
  }
}

export default withTranslation()(MyOrders);
