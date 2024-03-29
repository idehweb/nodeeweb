/* eslint-disable no-restricted-globals */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  ListGroup,
  ListGroupItem,
} from 'shards-react';
import { RadioGroup } from '@mui/material';
import style from '#c/assets/styles/Checkout.module.css';
import { combineUrl } from '@/functions/utils';

import store from '#c/functions/store';
import PriceChunker from './PriceChunker';
import { withTranslation, useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { MainUrl } from '#c/functions/index';

import GetDiscount from './GetDiscount';
import GetGateways from './GetGateways';
import { FormCheckbox } from 'shards-react';
import { OrderService } from '@/functions/order';
import { toast } from 'react-toastify';
import { OrderUtils } from '@/functions/order/utils';
import Loading from '../Loading';
import { CartService } from '@/functions/order/cart';

const LastPart = (props) => {
  const { t, theParams } = props;
  const { setPaymentMethod } = theParams;
  const navigate = useNavigate();
  const address = OrderUtils.getAddressChose();
  const post = OrderUtils.getPostChose();
  const formRef = useRef(null);
  let [lan, setLan] = useState(store.getState().store.lan || 'fa');
  let [rules, setRules] = useState(store.getState().store.lan || 'fa');
  let [isFormEnable, setFormEnable] = useState(false);
  const [gatewaySlug, setGatewaySlug] = useState(null);
  let [Transaction, setTransaction] = useState({});
  let [card, setCard] = useState({ data: [], state: 'none' });
  console.log('card,..................', card);

  let [themeData, setThemeData] = useState(
    store.getState().store.themeData || []
  );
  let [discountCode, setDiscountCode] = useState(
    theParams.discountCode || null
  );

  const [price, setPrice] = useState({ data: null, state: 'none' });

  const updatePrice = useCallback(async (discount) => {
    try {
      setPrice(({ data }) => ({ data, state: 'loading' }));
      const res = await OrderService.calcPrice({
        discount,
        address,
        post: { id: post.id },
      });
      setPrice({ data: res, state: 'success' });
    } catch (err) {
      toast.error(err.message);
      setPrice(({ data }) => ({ data, state: 'error' }));
    }
  }, []);
  const getCart = useCallback(async () => {
    setCard({ data: [], state: 'loading' });
    try {
      const res = await CartService.getAndSync({ listForm: true });
      setCard({ data: res, state: 'success' });
    } catch (err) {
      toast.error(err.message);
    }
  }, []);

  const setGateway = useCallback(
    async (g) => {
      console.log('setGateway', g);
      setGatewaySlug(g);
    },
    [setGatewaySlug]
  );

  const onCreateTransaction = useCallback(
    async (theGatewaySlug) => {
      setCard((data) => ({ ...data, state: 'loading' }));

      try {
        let obj = {
          post: { id: post.id },
          address,
          gatewaySlug: theGatewaySlug || gatewaySlug,
          discount: discountCode ?? undefined,
        };
        console.log('obj', obj);
        const { transactions } = await OrderService.createTransaction(obj);

        // clear cart
        CartService.clear();

        toast.success(t('Place Order'), {
          autoClose: 1000,
        });
        setTimeout(() => {
          const transaction = transactions.pop();
          if (transaction.payment_method == 'post') {
            setTransaction(transaction);
            setFormEnable(true);
            return;
          }
          if (
            (!transaction.payment_method ||
              (transaction.payment_method &&
                transaction.payment_method != 'post')) &&
            transaction.payment_link
          ) {
            if (
              transaction.payment_link.indexOf('http://') == 0 ||
              transaction.payment_link.indexOf('https://') == 0
            ) {
              // do something here
              window.location.replace(transaction.payment_link);
            } else {
              return navigate(transaction.payment_link, { replace: true });
            }
            return navigate('/profile', { replace: true });
          }
        }, 1000);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setCard((data) => ({ ...data, state: 'none' }));
      }
    },
    [discountCode]
  );

  const returnAmount = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  const returnTaxAmount = (taxAmount) => {
    return parseInt(taxAmount)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleRules = (e) => {
    setRules(e.target.value);
  };
  const setTheDiscount = (discount, v = 'price', code = '') => {
    if (!card) {
      card = store.getState().store.card;
    }
    if (!amount) {
      amount = 0;
      card.forEach((items) => {
        amount += items.count * (items.salePrice || items.price);
      });
    }
    if (v == 'price') {
      let ty = amount - discount;
      if (ty < 0) {
        ty = 0;
      }
      props.theParams.setDiscount(discount, code);
      props.theParams.setamount(ty);
      setDiscount(discount);
      setAmount(ty);
      // this.setState({discount: discount, amount: ty})
      return;
    } else if (v == 'percent') {
      let x = (amount * discount) / 100;
      x = parseInt(x);
      let ty = amount - x;
      if (ty < 0) {
        ty = 0;
      }
      props.theParams.setDiscount(discount, code);

      props.theParams.amount = ty;
      props.theParams.setamount(ty);
      setDiscount(x);
      setAmount(ty);
      return;
    }
  };
  const { _id, onNext, onPlaceOrder, onPrev } = props;
  let { currency = 'toman' } = themeData;

  const returnPrice = (price) => {
    if (themeData.tax && themeData.taxAmount) {
      let ta = parseInt(themeData.taxAmount);
      price = parseInt((ta / 100 + 1) * parseInt(price));
    }
    if (price)
      return (
        price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
        ' ' +
        t(themeData.currency)
      );
  };

  useEffect(() => {
    getCart();
  }, []);

  //   useEffect(() => {
  //     console.log('gatewaySlug',gatewaySlug);
  // setGatewaySlug(gatewaySlug);
  //   }, [gatewaySlug]);
  useEffect(() => {
    if (isFormEnable && Transaction) formRef.current.submit();
  }, [isFormEnable, Transaction]);

  useEffect(() => {
    updatePrice(discountCode);
  }, [discountCode]);
  if (isFormEnable) {
    return (
      <>
        <div style={{ textAlign: 'center' }}>{Transaction.payment_message}</div>
        <form
          style={{ display: 'none' }}
          ref={formRef}
          method={'post'}
          action={Transaction.payment_link}>
          <input name={'RefId'} value={Transaction.payment_body.RefId} />
          <input name={'amount'} value={Transaction.amount} />
          <input type={'submit'} />
        </form>
      </>
    );
  }
  return (
    <Card className="mb-3 pd-1">
      {price.state === 'loading' ||
        (card.state === 'loading' && (
          <div className={style.overlay}>
            <Loading />
          </div>
        ))}
      <CardHeader className={'pd-1'}>
        <div className="kjhghjk">
          <div
            className="d-inline-block item-icon-wrapper ytrerty"
            dangerouslySetInnerHTML={{ __html: t('check and pay') }}
          />
        </div>
      </CardHeader>
      <CardBody className={'pd-1'}>
        <Col lg="12">
          <ListGroup flush className={'card-add checkout'}>
            {card.data &&
              card.data.length > 0 &&
              card.data.map((item, idx2) => {
                return (
                  <ListGroupItem
                    key={idx2}
                    className="d-flex px-3 border-0 wedkuhg">
                    <img
                      className={'img-final'}
                      src={combineUrl(MainUrl, item.image)}
                      alt={item.title?.fa}
                    />
                    <div className={'flex-1 txc pt-1'}>
                      <div className={'bge'}>{item.count}</div>
                    </div>
                    {/* <div className={'flex-1 txc pt-1'}>x</div> */}
                    <div className={'flex-8'}>
                      <div className={'ttl'}>{item.title[lan]}</div>
                    </div>
                    <div className={'flex-2 pl-2'}>
                      <div className={'prc'}>{returnPrice(item.price)}</div>
                    </div>
                  </ListGroupItem>
                );
              })}
            <ListGroupItem className={'d-flex px-3 border-0 '}>
              {'ارسال به: '}
              {address.state + ' - '}
              {address.city + ' - '}
              {address.street}
            </ListGroupItem>
            <ListGroupItem className={'d-flex px-3 border-0 '}>
              {'روش ارسال: '}
              {post && post.title}
            </ListGroupItem>
            {/* <ListGroupItem className={'d-flex px-3 border-0 '}>
              {'درگاه پرداخت: '}
              {gatewaySlug}
            </ListGroupItem> */}
            {
              <ListGroupItem className={'d-flex px-3 border-0 '}>
                <div className={'flex-1'}>
                  <div className={'ttl'}>{t('discount code') + ': '}</div>
                </div>
                <div className={'flex-1'}>
                  <GetDiscount
                    setDiscount={(e, v = 'price', code = '') => {
                      setTheDiscount(e, v, code);
                    }}
                    setDiscountCode={setDiscountCode}
                  />
                </div>
              </ListGroupItem>
            }

            <ListGroupItem className={'d-flex px-3 border-0 '}>
              {[
                <div className={'flex-1'} key={'xo2'}>
                  <div className={'ttl'}>{t('goodprice') + ': '}</div>
                </div>,
                <div className={'flex-1 textAlignRight'} key={'xo3'}>
                  {price.data?.productsPrice && (
                    <div className={'ttl '}>
                      {returnPrice(price.data?.productsPrice)}
                    </div>
                  )}
                </div>,
              ]}
            </ListGroupItem>

            {discountCode && (
              <ListGroupItem className={'d-flex px-3 border-0 '}>
                <div className={'flex-1'}>
                  <div className={'ttl'}>{t('discount code') + ': '}</div>
                </div>
                <div className={'flex-1'}>
                  <div key={'xo5'} className={'flex-1 textAlignRight'}>
                    <div className={'ttl '}>{discountCode}</div>
                  </div>
                </div>
              </ListGroupItem>
            )}

            {price?.data?.discount && (
              <ListGroupItem className={'d-flex px-3 border-0 '}>
                <div className={'flex-1'}>
                  <div className={'ttl'}>{t('discount') + ': '}</div>
                </div>
                <div className={'flex-1'}>
                  <div key={'xo5'} className={'flex-1 textAlignRight'}>
                    <div className={'ttl '}>
                      {/* <div className={'attl-11 '}> */}
                      {price?.data?.discount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
                        ' ' +
                        t(currency)}
                    </div>
                  </div>
                </div>
              </ListGroupItem>
            )}
            <ListGroupItem className={'d-flex px-3 border-0 '}>
              {[
                <div className={'flex-1'} key={'xo4'}>
                  <div className={'ttl'}>{t('delivery') + ': '}</div>
                </div>,
                <div key={'xo5'} className={'flex-1 textAlignRight'}>
                  <div className={'ttl '}>
                    {price.data?.postPrice > 0 && (
                      <div className={'ttl'}>
                        {/* <div className={'attl-11'}> */}
                        {price.data?.postPrice
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
                          ' ' +
                          t(currency)}
                      </div>
                    )}

                    {(!price.data?.postPrice ||
                      price.data?.postPrice === 0) && (
                      <div className={'ttl '}>{t('free')}</div>
                    )}
                  </div>
                </div>,
              ]}
            </ListGroupItem>
            {price.data?.taxesPrice ? (
              <ListGroupItem className={'d-flex px-3 border-0 '}>
                {[
                  <div className={'flex-1'} key={'xo4'}>
                    <div className={'ttl'}>{t('tax') + ': '}</div>
                  </div>,
                  <div key={'xo5'} className={'flex-1 textAlignRight'}>
                    <div className={'ttl '}>
                      {price.data?.taxRate} -{' '}
                      {returnTaxAmount(price.data?.taxesPrice) +
                        ' ' +
                        t(currency)}
                    </div>
                  </div>,
                ]}
              </ListGroupItem>
            ) : null}
            <ListGroupItem className={'d-flex px-3 border-0 '}>
              {[
                <div className={'flex-1'} key={'xo6'}>
                  <div className={'ttl'}>{t('finalprice') + ': '}</div>
                </div>,
                <div key={'xo7'} className={'flex-1 textAlignRight'}>
                  <div className={'ttl '}>
                    {/* <div className={'attl-11 '}> */}
                    {price.data?.totalPrice &&
                      returnAmount(price.data?.totalPrice, 0) +
                        ' ' +
                        t(currency)}
                  </div>
                </div>,
              ]}
            </ListGroupItem>
            <ListGroupItem className={'d-flex px-3 border-0 '}></ListGroupItem>
            <ListGroupItem className={'d-flex px-3 border-0 '}>
              {/* {'درگاه پرداخت: '} */}
              {'روش پرداخت: '}
              {gatewaySlug?.includes('mellat')
                ? 'درگاه پرداخت بانک ملت'
                : 'پرداخت در محل'}
              {/* {gatewaySlug} */}
            </ListGroupItem>
            <GetGateways setGateway={(e) => setGateway(e)} />
          </ListGroup>
          <Col className={'empty ' + 'height50'} sm={12} lg={12}></Col>
          <ListGroup>
            <ListGroupItem className={'d-flex px-3 border-0 '}>
              <RadioGroup></RadioGroup>
            </ListGroupItem>
          </ListGroup>

          <hr />
          <FormCheckbox
            className={'terms-and-conditions-checkbox '}
            checked={rules}
            onChange={(e) => handleRules(e)}>
            <span>
              {t('I am agree with')}{' '}
              <Link to={'/terms-and-conditions'}>
                {t('terms and conditions')}
              </Link>{' '}
              {t('by clicking on the button')}
            </span>
          </FormCheckbox>
        </Col>
      </CardBody>
      <CardFooter className={'pd-1'}>
        <ButtonGroup size="sm right">
          <Button
            className={'back-to-choose-address '}
            left={'true'}
            onClick={onPrev}>
            <i className="material-icons">{'chevron_right'}</i>
            {t('prev')}
          </Button>
        </ButtonGroup>
        <ButtonGroup size="sm left">
          <Button
            className={'place-order '}
            left={'true'}
            onClick={() => onCreateTransaction(gatewaySlug)}>
            {t('Place Order')}
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default withTranslation()(LastPart);
