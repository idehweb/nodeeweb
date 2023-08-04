import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Row
} from "shards-react";

import store from "../functions/store";
import PageTitle from "../components/common/PageTitle";
// import UserDetails from "../components/profile/UserDetails";
import {withTranslation} from 'react-i18next';
import {buy, getOrder} from "../functions/index"
import {Navigate} from "react-router-dom";

class Order extends React.Component {
  constructor(props) {
    super(props);
    const {match} = props;
    this.state = {
      _id: match.params._id,
      sum: 0,
      redirect_url: '/login',
      lan: store.getState().store.lan || 'fa',
      token: store.getState().store.user.token || '',
      user: store.getState().store.user || {},
      redirect: null,
      update: false,
      modals: false,
      card: [],
      deliveryDay: {},
      orderNumber: '',
      status: '',
      paymentStatus: '',
      billingAddress: {},
      customer_data: {}

      // settings: store.getState().store.settings || []
    };
    // this.getSettings();
  }

  getTheOrder() {
    let {_id} = this.state;
    getOrder(_id).then((response) => {
      if (response.success) {
        this.setState({
          card: response.order.card,
          deliveryDay: response.order.deliveryDay,
          billingAddress: response.order.billingAddress,
          orderNumber: response.order.orderNumber,
          customer_data: response.order.customer_data,
          paymentStatus: response.order.paymentStatus,
          status: response.order.status,
          sum: response.order.sum,
        })
      }

    });
  }

  componentDidMount() {
    const {token} = this.state;
    if (this.props && this.props.match && this.props.match.params && this.props.match.params._id) {
      if (!token) {
        this.cameFromProduct(this.props.match.params._id);
        this.setState({redirect: '/login'})
      } else {
        this.getTheOrder();
      }
    }
  }

  componentDidUpdate() {
    if (this.state.update)
      this.setState({
        redirect: null,
        update: false
      })
    // window.scrollTo(0, 0);
  }

  editThisAdd() {

  }

  CancelOrder() {


  }

  PayForOrder() {
    let {sum,_id,customer_data} = this.state;
    buy(_id,{
      sum:sum,
      customer:customer_data._id
    }).then((trans) => {
      window.createPaymentRequest({
        service_id: 18875,
        merchant_id: 13468,
        amount: sum,
        transaction_param: "rqBEoqFwJt2L",
        merchant_user_id: 21132,
      }, function (data) {
        if (data && data.status == 2) {
          console.log('payment success');
        }
      });
    });
  }

  cameFromProduct(d) {
    // goToProduct(d);
  }

  render() {
    const {t, _id} = this.props;
    // let sum = 0;
    let {card, orderNumber, redirect, redirect_url, paymentStatus, status, deliveryDay, sum, lan, modals, token, billingAddress, customer_data, hoverD} = this.state;
    sum = 0;
    if (!token) {
      redirect = true;
    }
    if (redirect) {
      return <Navigate to={redirect_url} push={false} exact={true}/>
    } else {
      return (
        <Container fluid className="main-content-container px-4 maxWidth1200">
          <Row noGutters className="page-header py-4">
            <PageTitle title={t('Order #') + orderNumber + ' - ' + t(paymentStatus) + ' - ' + t(status)}
                       subtitle={t('order details')} md="12"
                       className="ml-sm-auto mr-sm-auto"/>
          </Row>
          <Row>
            {/*<Col lg="4">*/}
            {/*<UserDetails />*/}
            {/*</Col>*/}

            <Col lg="7">

              <Card className="mb-3">
                <CardHeader>
                  <h1 className="kjhghjk">
                    <div
                      className="d-inline-block item-icon-wrapper ytrerty"
                      dangerouslySetInnerHTML={{__html: t('Contact number')}}
                    />
                  </h1>
                </CardHeader>
                <CardBody>
                  <Col lg="12">
                    <Row>
                      {customer_data && customer_data.phoneNumber}
                    </Row>
                  </Col>
                </CardBody>
              </Card>

              <Card className="mb-3">
                <CardHeader>
                  <h1 className="kjhghjk">
                    <div
                      className="d-inline-block item-icon-wrapper ytrerty"
                      dangerouslySetInnerHTML={{__html: t('Address')}}
                    />

                  </h1>
                </CardHeader>
                <CardBody>
                  <Col lg="12">
                    <Row>

                      {billingAddress && (<Col md={4} lg={4} sm={4}>
                        <div className={'theadds posrel hover'}>
                          {/*<div className={'white p-2'}>*/}
                          <div className={'ttl'}>
                            {billingAddress.Title}
                          </div>
                          <div className={'desc'}>
                            {billingAddress.Country}
                            <br></br>
                            {billingAddress.State}
                            <br></br>
                            {billingAddress.City}
                            <br></br>

                            {billingAddress.StreetAddress}
                            <br></br>

                            {billingAddress.Zip}

                          </div>
                          <div className={' d-flex posab bilar'}>
                            <div className={'flex-1 pr-2 textAlignLeft theb'}>

                                  <span className="material-icons circle-button green" onClick={() => {
                                    this.editThisAdd(billingAddress)
                                  }}>edit</span>
                            </div>

                          </div>

                        </div>
                      </Col>)
                      }
                    </Row>
                  </Col>
                </CardBody>
              </Card>

              <Card className="mb-3">
                <CardHeader>
                  <h1 className="kjhghjk">
                    <div
                      className="d-inline-block item-icon-wrapper ytrerty"
                      dangerouslySetInnerHTML={{__html: t('Delivery Schedule')}}
                    />

                  </h1>
                </CardHeader>
                <CardBody>
                  <Col lg="12">
                    <Row>
                      {deliveryDay && (

                        <Col className={'mb-4'} md={4} lg={4} sm={4}>
                          <div className={'theadds hover'}>
                            <div className={'ttl'}>
                              {deliveryDay.title}
                            </div>
                            <div className={'desc'}>
                              {deliveryDay.description}
                            </div>

                          </div>
                        </Col>
                      )
                      }
                    </Row>
                  </Col>
                </CardBody>
              </Card>


            </Col>
            <Col lg="5">

              <Card className="mb-3">
                <CardHeader>
                  <h1 className="kjhghjk">
                    <div
                      className="d-inline-block item-icon-wrapper ytrerty"
                      dangerouslySetInnerHTML={{__html: t('Your order')}}
                    />
                  </h1>
                </CardHeader>
                <CardBody>
                  {/*<Col lg="12">*/}
                  {/*<Row>*/}
                  <ListGroup flush className={'card-add checkout'}>

                    {card && card.length > 0 && card.map((item, idx2) => {

                      if (item.salePrice) {
                        sum += (item.salePrice * item.count);

                      } else if (item.price && !item.salePrice) {
                        sum += (item.price * item.count);
                      }
                      return (<ListGroupItem key={idx2} className="d-flex px-3 border-0 wedkuhg">
                        {/*<ListGroupItemHeading>*/}
                        <div className={'flex-1 txc'}>
                          <div className={'bge'}>
                            {item.count}
                          </div>
                        </div>
                        <div className={'flex-1 txc'}>
                          x
                        </div>
                        <div className={'flex-8'}>
                          <div className={'ttl'}>{item.title[lan]}</div>

                        </div>
                        <div className={'flex-2'}>
                          {(item.price && !item.salePrice) && <div
                            className={'prc'}>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+t(' UZS')}</div>}
                          {(item.price && item.salePrice) && <div
                            className={'prc'}>{item.salePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+t(' UZS')}
                            <del
                              className={'ml-2'}>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+t(' UZS')}</del>
                          </div>}
                        </div>

                        {/*</ListGroupItemHeading>*/}
                      </ListGroupItem>);
                    })}
                    <hr></hr>
                    <ListGroupItem className={'d-flex px-3 border-0 '}>
                      {[<div className={'flex-1'}>
                        <div className={'ttl'}>{t('sum') + ": "}</div>

                      </div>,
                        <div className={'flex-1 textAlignRight'}>
                          {sum && <div
                            className={'ttl '}>{sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+t(' UZS')}</div>}

                        </div>]}
                    </ListGroupItem>
                  </ListGroup>


                  <Col className={"empty " + "height50"} sm={12} lg={12}>

                  </Col>
                </CardBody>
                <CardFooter>
                  {paymentStatus == 'notpaid' && <Button className={''} block onClick={() => {
                    this.PayForOrder()
                  }}>{t('Pay')}</Button>}
                  <Button className={''} block onClick={() => {
                    this.CancelOrder()
                  }}>{t('Cancel Order')}</Button>

                </CardFooter>
              </Card>
            </Col>

          </Row>
        </Container>
      );
    }
  }
}

export default withTranslation()(Order);
