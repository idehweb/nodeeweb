/* eslint-disable no-restricted-globals */
import React, { useCallback, useEffect, useRef, useState } from 'react';
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

import { withTranslation } from 'react-i18next';

import { Link, useNavigate } from 'react-router-dom';

import { FormCheckbox } from 'shards-react';

import { toast } from 'react-toastify';

import style from '#c/assets/styles/Checkout.module.css';

import store from '#c/functions/store';

import { OrderService } from '@/functions/order';

import { OrderUtils } from '@/functions/order/utils';
import Loading from '../Loading';
import { CartService } from '@/functions/order/cart';

import GetGateways from './GetGateways';
import GetDiscount from './GetDiscount';

const LastPart = (props) => {
  const { t, theParams } = props;
  const navigate = useNavigate();
  const address = OrderUtils.getAddressChose();
  const post = OrderUtils.getPostChose();

  let [lan, setLan] = useState(store.getState().store.lan || 'fa');
  let [rules, setRules] = useState(store.getState().store.lan || 'fa');
  let [card, setCard] = useState({ data: [], state: 'none' });
  const [paymentRequestSend, setPaymentRequestSend] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState();
  const formRef = useRef(null);
  const gatewayRef = useRef(null);

  // const choosenGateway = gatewayRef.getGateway();

  // console.log('gateway choosed is #tracecode lp-l-42', choosenGateway);

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

  const onCreateTransaction = useCallback(async () => {
    setCard((data) => ({ ...data, state: 'loading' }));
    try {
      const { transactions } = await OrderService.createTransaction({
        post: { id: post.id },
        address,
        discount: discountCode ?? undefined,
        gatewaySlug: gatewayRef.current.getGateway() ?? '',
      });

      // clear cart
      CartService.clear();

      toast.success(t('Place Order'), {
        autoClose: 1000,
      });
      const transaction = transactions.pop();
      setTransactionDetails(transaction);

      if (transaction.payment_method.toLowerCase() === 'get') {
        if (transaction.payment_link)
          return navigate(transaction.payment_link, { replace: true });
      } else {
        setPaymentRequestSend(true);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCard((data) => ({ ...data, state: 'none' }));
    }
  }, [discountCode]);

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

  useEffect(() => {
    if (paymentRequestSend) {
      formRef.current.submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentRequestSend]);

  useEffect(() => {
    updatePrice(discountCode);
  }, [discountCode]);

  return paymentRequestSend ? (
    <>
      <form
        ref={formRef}
        onSubmit={onCreateTransaction}
        method={transactionDetails.payment_method}
        name="formBank"
        id="formBank"
        action={transactionDetails.payment_link}>
        <input
          type="hidden"
          value={transactionDetails.payment_body.RefId}
          id="RefId"
          name="RefId"
        />
        <div class="TextDescription">در حال انتقال به درگاه بانک ملت ...</div>
        <input type="submit" value="پرداخت" class="hide" />
      </form>
    </>
  ) : (
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
                  <div className={'ttl'}>{t('sum') + ': '}</div>
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
                      <div className={'ttl '}>
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
                  <div className={'ttl'}>{t('amount') + ': '}</div>
                </div>,
                <div key={'xo7'} className={'flex-1 textAlignRight'}>
                  <div className={'ttl '}>
                    {price.data?.totalPrice &&
                      returnAmount(price.data?.totalPrice, 0) +
                        ' ' +
                        t(currency)}
                  </div>
                </div>,
              ]}
            </ListGroupItem>
            <ListGroupItem className={'d-flex px-3 border-0 '}></ListGroupItem>
          </ListGroup>
          <GetGateways ref={gatewayRef} />

          <Col className={'empty height50'} sm={12} lg={12}></Col>
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
            onClick={() => {
              onCreateTransaction();
              // console.log(gatewayRef.current.getGateway());
            }}>
            {t('Place Order')}
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default withTranslation()(LastPart);
