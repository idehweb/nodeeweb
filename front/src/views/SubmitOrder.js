import React from "react";
import {Button, Card, CardBody, CardHeader, Col, Container, ListGroup, ListGroupItem, Row} from "shards-react";
import {toast} from "react-toastify";

import store from "../functions/store";

import PageTitle from "../components/common/PageTitle";
import CreateForm from "../components/form/CreateForm";
import pageData from "./../functions/pageData"
// import UserDetails from "../components/profile/UserDetails";
import {withTranslation} from 'react-i18next';
import {addToCard, buy, createOrder, goToProduct, MainUrl, updateCard} from "../functions/index"
import {Navigate} from "react-router-dom";

class SubmitOrder extends React.Component {
  constructor(props) {
    super(props);
    // const {_id} = props;
    this.state = {
      sum: 0,
      card: store.getState().store.card || [],
      lan: store.getState().store.lan || 'fa',
      token: store.getState().store.token || '',
      redirect: null,
      update: false,
      submitOrder: {
        add: {
          data: {
            firstName:store.getState().store.firstName || '',
            lastName:store.getState().store.lastName || '',
            email:store.getState().store.email || '',
            phoneNumber:store.getState().store.phoneNumber || '',
          },
          fields: [
            {
              type: 'input',
              label: 'First Name',
              size: {
                sm: 12,
                lg: 12,
              },

              onChange: (text) => {
                this.state.submitOrder.add.data['firstName'] = text;
                this.state.submitOrder.add.fields[0]['value'] = text;
              },
              placeholder: 'First Name',
              child: [],
              // value:''
              value: store.getState().store.firstName || '',
            },
            {
              type: 'input',
              label: 'Last Name',

              size: {
                sm: 12,
                lg: 12,
              },
              onChange: (text) => {
                this.state.submitOrder.add.data['lastName'] = text;
              },
              placeholder: 'Last Name',
              child: [],
              value: store.getState().store.lastName || '',
              // value:''
            },
            {
              type: 'email',
              label: 'Email',

              size: {
                sm: 12,
                lg: 12,
              },
              onChange: (text) => {
                this.state.submitOrder.add.data['email'] = text;
              },
              placeholder: 'Email (optional)',
              child: [],
              // value:''
              value: store.getState().store.email || '',
            },
            {
              type: 'input',
              label: 'Phone number',

              size: {
                sm: 12,
                lg: 12,
              },
              onChange: (text) => {
                this.state.submitOrder.add.data['phoneNumber'] = text;
              },
              className: 'ltr',
              placeholder: '0912*******',
              child: [],
              value: store.getState().store.phoneNumber || '',
            },

            {
              type: 'empty',
              size: {
                sm: 12,
                lg: 12,
              },
              className: 'height50',
              placeholder: '',
              child: [],
            },
          ],
          buttons: [
            {
              type: 'small',
              header: [],
              body: ['title', 'text'],
              url: '/order/',
              name: 'submit order and pay',
              className: 'place-order ml-auto ffgg btn btn-accent btn-lg',
              size: {
                sm: 12,
                lg: 12,
              },
              onClick: async (e) => {
                console.log('this.data', this.state.submitOrder.add.data);
                let {
                  firstName,
                  lastName,
                  phoneNumber,
                  email,
                } = this.state.submitOrder.add.data;
                let { card, agent, link } = store.getState().store;
                let err = '';
                if (!firstName) err = 'Enter your first name';

                if (!lastName) err = 'Enter your last name';
                if (!phoneNumber) err = 'Enter your phone number';
                if (err) return toast.error(err);

                let s = 0;
                card.map((c, i) => {
                  s += c.price;
                  return;
                });
                createOrder({
                  sum: s,
                  customer_data: {
                    firstName,
                    lastName,
                    phoneNumber,
                    email,
                  },
                  card: card,
                  agent: agent,
                  link: link,
                }).then((res) => {
                  console.log('res for judytgs is:', res.order._id);
                  buy(res.order._id).then((add) => {
                    console.log('ass', add);
                    window.location.replace(add.url);
                  });
                });
              },
            },
          ],
        },
      },

    };
  }

  async removeItem(idx) {
    console.log('removeItem', idx)
    const {t} = await this.props;
    let {card, sum} = await this.state;
    let arr = [];
    await card.map(async (c, i) => {

      if (idx !== i) {
        console.log(i, idx);
        await arr.push(c)

      } else if (idx === i) {
        if (c.salePrice) {
          sum -= c.count * c.salePrice;
        } else if (c.price) {
          sum -= c.count * c.price;
        }
      }
      return;
    })
    console.log('cardddd', arr);
    if (sum < 0) {
      sum = 0;
    }
    await updateCard(arr, sum).then(() => {
      this.setState({
        card: arr,
        sum: sum
      })
      console.log('toasts,,', arr);

      toast(t('Item deleted!'), {
        type: 'warning'
      })
    });


  }

  async addItem(idx) {
    let {card, sum} = await this.state;
    sum = 0;
    console.log('sum is',sum);
    let arr = [];
    await card.map(async (c, i) => {
      if (c.salePrice) {
        sum += c.salePrice;

      } else if (c.price)
        sum += c.price;
      if (idx === i) {
        console.log(i, idx);
        c.count = c.count + 1;
        if (c.salePrice) {
          sum += c.salePrice;

        } else if (c.price)
          sum += c.price;
      }
      await arr.push(c)

      return;
    })
    console.log('cardddd', arr);

    await updateCard(arr, sum).then(() => {
      this.setState({
        card: arr,
        sum: sum
      })

    });

  }

  async minusItem(idx) {
    let {card, sum} = await this.state;
    sum = 0;
    console.log('sum is', sum);
    let arr = [];
    await card.map(async (c, i) => {
      if (c.salePrice) {
        sum += c.salePrice;

      } else if (c.price)
        sum += c.price;
      if (idx === i) {
        console.log(i, idx);
        c.count = c.count - 1;
        if (c.salePrice) {
          sum -= c.salePrice;

        } else if (c.price)
          sum -= c.price;
        if (c.count === 0) {
          this.removeItem(idx);
          return;
        }
      }
      await arr.push(c)

      return;
    })
    console.log('cardddd', arr);

    await updateCard(arr, sum).then(() => {
      this.setState({
        card: arr,
        sum: sum
      })

    });
  }

  componentDidMount() {
    console.log('componentDidMount')
    console.log('this.props', this.props.match.params._id);
    const {token} = this.state;
    if (this.props && this.props.match && this.props.match.params && this.props.match.params._id) {
      if (!token) {
        this.cameFromProduct(this.props.match.params._id);
        this.setState({redirect: '/login'})
      } else {
        addToCard(this.props.match.params._id).then((card) => {
          console.log('hgfds', card);
          this.setState({card})
        });
      }
    }
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
    if (this.state.update)
      this.setState({
        redirect: null,
        update: false
      })
    window.scrollTo(0, 0);
  }

  cameFromProduct(d) {
    goToProduct(d);
  }

  render() {
    const {t, _id} = this.props;
    // let sum = 0;
    let {card, redirect, sum,lan} = this.state;
    sum = 0;
    console.log('sum', sum);
    console.log('card', card);
    // return null;
    if (redirect) {
      // console.log('_id', _id);
      // if (!_id) {
      //   _id = this.props.match.params._id;
      // }
      // this.cameFromProduct(_id);
      return <Navigate to={'/login/'} push={false} exact={true}/>
    } else {
      return (
        <Container fluid className="main-content-container px-4">
          <Row noGutters className="page-header py-4">
            <PageTitle title={t('Submit order')} subtitle={t('order details')} md="12"
                       className="ml-sm-auto mr-sm-auto"/>
          </Row>
          <Row>
            {/*<Col lg="4">*/}
            {/*<UserDetails />*/}
            {/*</Col>*/}

            <Col lg="6">

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
                  <ListGroup flush className={'card-add'}>

                    {card && card.length > 0 && card.map((item, idx) => {

                      if (item.salePrice) {
                        sum += (item.salePrice * item.count);

                      } else if (item.price && !item.salePrice) {
                        sum += (item.price * item.count);
                      }
                      return (<ListGroupItem key={idx} className="d-flex px-3 border-0 wedkuhg">
                        {/*<ListGroupItemHeading>*/}
                        <div className={'flex-1 txc'}>
                          <div className={'bge'}>
                            <Button className={' thisiscarda'} onClick={(e) => {
                              e.preventDefault();
                              this.addItem(idx);
                            }}> <span className="material-icons">add</span></Button>
                            <div className={'number'}>
                              {item.count}
                            </div>
                            <Button className={' thisiscarda'} onClick={(e) => {
                              e.preventDefault();

                              this.minusItem(idx);
                            }}> <span className="material-icons">remove</span></Button>
                          </div>
                        </div>
                        <div className={'flex-1 txc imgds mr-2 ml-1'}>
                          {(item.photos && item.photos[0]) &&
                          <img className={'gfdsdf'} src={MainUrl + '/' + item.photos[0]}/>}
                        </div>
                        <div className={'flex-8'}>
                          <div className={'ttl'}>{item.title[lan]}</div>
                          {(item.price && !item.salePrice) && <div
                            className={'prc'}>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+t(' UZS')}</div>}
                          {(item.price && item.salePrice) && <div
                            className={'prc'}>{item.salePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+t(' UZS')}
                            <del
                              className={'ml-2'}>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+t(' UZS')}</del>
                          </div>}
                        </div>
                        <div className={'flex-1'}>
                          <Button className={'red'} onClick={() => {
                            this.removeItem(idx);
                          }}> <span className="material-icons">clear</span></Button>
                        </div>
                        {/*</ListGroupItemHeading>*/}
                      </ListGroupItem>);
                    })}
                    <ListGroupItem className={'bottom-row'}>
                      {[<div className={'flex-1'}>
                        <div className={'ttl'}>{t('sum') + ": "}</div>

                      </div>,
                        <div className={'flex-1'}>
                          {sum && <div
                            className={'ttl gtrf'}>{sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+t(' UZS')}</div>}

                        </div>]}
                    </ListGroupItem>
                  </ListGroup>

                  <Col className={"empty " + "height50"} sm={12} lg={12}>

                  </Col>
                  <CreateForm
                    buttons={this.state.submitOrder.add.buttons}
                    fields={[]}/>
                  {/*</Row>*/}
                  {/*</Col>*/}
                </CardBody>
              </Card>
            </Col>
            <Col lg="6">

              <Card className="mb-3">
                <CardHeader>
                  <h1 className="kjhghjk">
                    <div
                      className="d-inline-block item-icon-wrapper ytrerty"
                      dangerouslySetInnerHTML={{__html: t('Order details')}}
                    />
                  </h1>
                </CardHeader>
                <CardBody>
                  <Col lg="12">
                    <Row>
                      <CreateForm
                        buttons={[]}
                        fields={this.state.submitOrder.add.fields}/>
                    </Row>
                  </Col>
                </CardBody>
              </Card>


            </Col>

          </Row>
        </Container>
      );
    }
  }
}

export default withTranslation()(SubmitOrder);
