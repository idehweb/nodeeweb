import React, {useState,useEffect} from "react";
import {Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Col, ListGroup, ListGroupItem} from "shards-react";
import {RadioGroup} from '@mui/material';

import store from "#c/functions/store";
import PriceChunker from "./PriceChunker";
// import State from "#c/data/state";
import {withTranslation} from 'react-i18next';
import {Link} from "react-router-dom";

import {
  buy,
  changeAddressArr,
  createOrder,
  getTheChaparPrice,
  getTheSettings,
  goToProduct,
  savePost,
  updateAddress,
  updateCard
} from "#c/functions/index"
import GetDiscount from "./GetDiscount";
import GetGateways from "./GetGateways";
import { FormCheckbox } from "shards-react";
const LastPart2 = (props) => {

}

// class LastPart extends React.Component {
const LastPart = (props) => {
console.log('props',props)
  // constructor(props) {
  //   super(props);
  const {t, theParams} = props;
  let [lan, setLan] = useState(store.getState().store.lan || 'fa');
  let [rules, setRules] = useState(store.getState().store.lan || 'fa');
  let [card, setCard] = useState(store.getState().store.card || []);
  let [themeData, setThemeData] = useState(store.getState().store.themeData || []);
  let [discount, setDiscount] = useState(theParams.discount || null);
  let [discountCode, setDiscountCode] = useState(theParams.discountCode || null);
  let [order_id, setOrder_id] = useState(store.getState().store.order_id || null);
  let [paymentMethod, setPaymentMethod] = useState('zarinpal');
  let [sum, setSum] = useState(theParams.sum || 0);
  let [return_url, setReturn_url] = useState('');
  let [deliveryPrice, setDeliveryPrice] = useState(theParams.deliveryPrice || 0);
  let [amount, setAmount] = useState(theParams.amount || 0);
  // let [state,setState] =useState({
  //   return_url: '',//window.location.origin + window.location.pathname + 'my-orders',
  //   deliveryPrice: theParams.deliveryPrice || 0,
  //   amount: theParams.amount || 0,
  // });
  // this.getSettings();
  // }

  const returnAmount = (amount, taxAmount = 0) => {
    console.log('      this.props.theParams.', amount)
    if (!amount) {
      amount = sum;
    }
    if (deliveryPrice) {
      amount = parseInt(deliveryPrice) + parseInt(amount)
    }
    // return deliveryPrice
    if (themeData.tax) {
      let x = ((taxAmount / 100) * sum)
      amount = amount + x;
      amount = parseInt(amount);
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    } else {
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    }
  }
  const returnTaxAmount = (taxAmount = 0) => {
    let x = ((taxAmount / 100) * sum)
    if (x)
      return parseInt(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    else
      return 0
  }

  const handleRules = (e) => {
    setRules(e.target.value)
  }
  const setTheDiscount = (discount, v = 'price', code = '') => {
    if (!card) {
      card = store.getState().store.card;
    }
    if (!amount) {
      amount = 0;
      card.forEach((items) => {
        amount += (items.count) * (items.salePrice || items.price);
      })
    }
    if (v == 'price') {
      let ty = amount - discount;
      if (ty < 0) {
        ty = 0
      }
      props.theParams.setDiscount(discount, code)
      props.theParams.setamount(ty)
      setDiscount(discount)
      setAmount(ty)
      // this.setState({discount: discount, amount: ty})
      return
    } else if (v == 'percent') {


      let x = (amount * discount) / 100
      x = parseInt(x)
      let ty = amount - x;
      if (ty < 0) {
        ty = 0
      }
      console.log('discount', x)
      console.log('amount', amount)
      console.log('this.amount', ty)
      props.theParams.setDiscount(discount, code)

      props.theParams.amount = ty;
      props.theParams.setamount(ty)
      setDiscount(x);
      setAmount(ty);
      return
    }
  }
// useEffect(()=>{
//   if(theParams.discountCode){
//
//   }
// },[]);
  const {_id, onNext, onPlaceOrder, onPrev} = props;
  // let sum = 0;
  console.log('theParams', theParams);
  let {address, setting} = theParams;
  // let {order_id, return_url, card, lan, themeData, discount, discountCode} = this.state;
  let {currency = 'toman', tax = false, taxAmount = 0} = themeData;
  // console.log(' this.state', this.state);
// return JSON.stringify(themeData)
  const returnPrice = (price) => {
    if (themeData.tax && themeData.taxAmount) {
      let ta = parseInt(themeData.taxAmount)
      price = parseInt(((ta / 100) + 1) * parseInt(price))
    }
    if (price)
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + t(themeData.currency)
  }
  let LIMIT=100000000
  let temp = amount;
  return (
    <Card className="mb-3 pd-1">
      <CardHeader className={'pd-1'}>
        <div className="kjhghjk">
          <div
            className="d-inline-block item-icon-wrapper ytrerty"
            dangerouslySetInnerHTML={{__html: t('check and pay')}}
          />
        </div>
      </CardHeader>
      <CardBody className={'pd-1'}>
        <Col lg="12">

          {/*<Col lg="12">*/}
          {/*<Row>*/}
          <ListGroup flush className={'card-add checkout'}>

            {card && card.length > 0 && card.map((item, idx2) => {
              //
              // if (item.salePrice) {
              // sum += (item.salePrice * item.count);
              //
              // } else if (item.price && !item.salePrice) {
              // sum += (item.price * item.count);
              // }
              return (<ListGroupItem key={idx2} className="d-flex px-3 border-0 wedkuhg">
                {/*<ListGroupItemHeading>*/}
                <div className={'flex-1 txc pt-1'}>
                  <div className={'bge'}>
                    {item.count}
                  </div>
                </div>
                <div className={'flex-1 txc pt-1'}>
                  x
                </div>
                <div className={'flex-8'}>
                  <div className={'ttl'}>{item.title[lan]}</div>

                </div>
                <div className={'flex-2 pl-2'}>
                  {(item.price && !item.salePrice) && <div
                    className={'prc'}>{returnPrice(item.price * item.count)}</div>}
                  {(item.price && item.salePrice) && <div
                    className={'prc'}>{returnPrice(item.salePrice * item.count)}
                    {/*<del*/}
                    {/*className={'ml-2'}>{t('$') + item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</del>*/}
                  </div>}
                </div>

                {/*</ListGroupItemHeading>*/}
              </ListGroupItem>);
            })}
            <ListGroupItem className={'d-flex px-3 border-0 '}>
              {'ارسال به: '}
              {address.State + ' - '}
              {address.City + ' - '}
              {address.StreetAddress}
            </ListGroupItem>
            <ListGroupItem className={'d-flex px-3 border-0 '}>
              {'روش ارسال: '}
              {setting && setting.title}

            </ListGroupItem>
            {!discount && <ListGroupItem className={'d-flex px-3 border-0 '}>
              <div className={'flex-1'}>
                <div className={'ttl'}>{t('discount code') + ": "}</div>

              </div>
              <div className={'flex-1'}>

                <GetDiscount price={amount} setDiscount={(e, v = 'price', code = '') => {
                  setTheDiscount(e, v, code)
                }} setDiscountCode={setDiscountCode} order_id={order_id}/>
              </div>
            </ListGroupItem>}


            <ListGroupItem className={'d-flex px-3 border-0 '}>
              {[<div className={'flex-1'} key={'xo2'}>
                <div className={'ttl'}>{t('sum') + ": "}</div>

              </div>,
                <div className={'flex-1 textAlignRight'} key={'xo3'}>
                  {sum && <div
                    className={'ttl '}>{returnPrice(sum)}</div>}

                </div>]}

            </ListGroupItem>

            {discountCode && <ListGroupItem className={'d-flex px-3 border-0 '}>
              <div className={'flex-1'}>
                <div className={'ttl'}>{t('discount code') + ": "}</div>

              </div>
              <div className={'flex-1'}>
                <div key={'xo5'} className={'flex-1 textAlignRight'}>
                  <div
                    className={'ttl '}>{discountCode}</div>
                </div>

              </div>
            </ListGroupItem>}

            {discount && <ListGroupItem className={'d-flex px-3 border-0 '}>
              <div className={'flex-1'}>
                <div className={'ttl'}>{t('discount') + ": "}</div>

              </div>
              <div className={'flex-1'}>
                <div key={'xo5'} className={'flex-1 textAlignRight'}>
                  <div
                    className={'ttl '}>{discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + t(currency)}</div>
                </div>

              </div>
            </ListGroupItem>}
            <ListGroupItem className={'d-flex px-3 border-0 '}>

              {[<div className={'flex-1'} key={'xo4'}>
                <div className={'ttl'}>{t('delivery') + ": "}</div>

              </div>,
                <div key={'xo5'} className={'flex-1 textAlignRight'}>
                  <div className={'ttl '}>
                    {((deliveryPrice > 0)) && <div
                      className={'ttl '}>
                      {/*{deliveryPrice}*/}
                      {deliveryPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + t(currency)}
                    </div>}

                    {(!deliveryPrice || deliveryPrice === 0) && <div
                      className={'ttl '}>
                      {t('free')}
                    </div>}
                  </div>

                </div>]}
            </ListGroupItem>
            {tax && <ListGroupItem className={'d-flex px-3 border-0 '}>

              {[<div className={'flex-1'} key={'xo4'}>
                <div className={'ttl'}>{t('tax') + ": "}</div>

              </div>,
                <div key={'xo5'} className={'flex-1 textAlignRight'}>
                  <div className={'ttl '}>
                    {taxAmount + '%'} - {returnTaxAmount(taxAmount) + " " + t(currency)}
                  </div>

                </div>]}
            </ListGroupItem>}
            <ListGroupItem className={'d-flex px-3 border-0 '}>

              {[<div className={'flex-1'} key={'xo6'}>
                <div className={'ttl'}>{t('amount') + ": "}</div>

              </div>,
                <div key={'xo7'} className={'flex-1 textAlignRight'}>
                  <div
                    className={'ttl '}>{amount && (returnAmount(amount, taxAmount) + " " + t(currency))}</div>


                </div>]}
            </ListGroupItem>
            <ListGroupItem className={'d-flex px-3 border-0 '}>
              {/*<ListGroup className={'width100'}>*/}
              <GetGateways setPaymentMethod={props.theParams.setPaymentMethod}/>
              {/*</ListGroup>*/}
            </ListGroupItem>
            {Boolean(amount > LIMIT) && <ListGroupItem className={'d-flex px-3 border-0 '}>

              {[<div className={'flex-1'} key={'xo8'}>
                <div className={'ttl'}>{'سقف پرداخت اینترنتی ۵۰ میلیون تومان است.'}</div>
                <div className={'ttl'}>{'باید در چند مرحله پرداخت کنید:'}</div>

              </div>,
                <div className={'flex-1 textAlignRight'} key={'xo9'}>
                  <PriceChunker price={amount} onPlaceOrder={onPlaceOrder}/>
                </div>]}
            </ListGroupItem>}
          </ListGroup>
          <Col className={"empty " + "height50"} sm={12} lg={12}>

          </Col>
          <ListGroup>
            <ListGroupItem className={'d-flex px-3 border-0 '}>
              <RadioGroup>
              </RadioGroup>

            </ListGroupItem>
          </ListGroup>

          <hr/>
          <FormCheckbox
            className={'terms-and-conditions-checkbox '}
            checked={rules}
            onChange={e => handleRules(e)}
          >
            <span>{t('I am agree with')}{" "}<Link to={'/terms-and-conditions'}>{t("terms and conditions")}</Link>{" "}{t('by clicking on the button')}</span>
          </FormCheckbox>
        </Col>
      </CardBody>
      <CardFooter className={'pd-1'}>
        <ButtonGroup size="sm right">
          <Button className={'back-to-choose-address '} left={"true"} onClick={onPrev}><i
            className="material-icons">{'chevron_right'}</i>{t('prev')}</Button>
        </ButtonGroup>
        {/*{amount}*/}
        {Boolean(amount <= LIMIT) && <ButtonGroup size="sm left">
          <Button className={'place-order '} left={"true"} onClick={() => onPlaceOrder(0)}>{t('Place Order')}</Button>

        </ButtonGroup>}

      </CardFooter>
    </Card>
  );
}

export default withTranslation()(LastPart);
