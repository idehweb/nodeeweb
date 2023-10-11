import React, { useCallback, useState } from 'react';

import clsx from 'clsx';
import { Button, Col, ListGroupItem } from 'shards-react';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { toast } from 'react-toastify';
import { withTranslation } from 'react-i18next';

import { MainUrl, toggleCardbar, updateCard } from '#c/functions/index';

import Swiper from '#c/components/swiper';

import store from '#c/functions/store';
import { CartService } from '@/functions/order/cart';

import CardbarMainNavbar from './CardbarMainNavbar';

const CardSidebar = ({ t }) => {
  const themeData = useSelector((st) => st.store.themeData);
  if (!themeData.currency) {
    themeData.currency = 'toman';
  }
  const cardVisible = useSelector((st) => !!st.store.cardVisible);
  const cart = useSelector((st) => st.store.cart);
  const handleToggleCardbar = () => toggleCardbar(true);

  const classes = clsx(
    'main-sidebar',
    'card-sidebar',
    'px-0',
    'col-12',
    cardVisible && 'open'
  );
  let [sum, setSum] = useState(0);
  let [lan, setLan] = useState(store.getState().store.lan || 'fa');

  const handleToast = async () => {
    toast(t('You did not add anything to cart!'), {
      type: 'error',
    });
  };
  const returnTotalPrice = (cart = {}) => {
    let price = Object.values(cart)
      .map((p) => (p.salePrice || p.price) * p.quantity)
      .reduce((prev, curr) => (isNaN(curr) ? curr : prev + curr), 0);
    if (!price) return price;
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

  const onAdd = useCallback(async (combId, product) => {
    await CartService.modify(product, {
      ...product,
      _id: combId,
      quantity: product.quantity + 1,
    });
  }, []);
  const onMinus = useCallback(async (combId, product) => {
    await CartService.modify(product, {
      ...product,
      _id: combId,
      quantity: product.quantity - 1,
    });
  }, []);
  const onDelete = useCallback(async (combId, product) => {
    await CartService.delete(product._id, combId);
  }, []);

  return (
    <Col tag="aside" className={classes} lg={{ size: 3 }} md={{ size: 4 }}>
      <CardbarMainNavbar />

      <div flush="true" className={'card-add'}>
        {cart &&
          Object.entries(cart).map(([comId, product], idx) => {
            return (
              <ListGroupItem
                key={idx + ''}
                className="d-flex px-3 border-0 wedkuhg">
                <div className={'flex-1 txc'}>
                  <div className={'bge'}>
                    <Button
                      className={' thisiscarda'}
                      onClick={() => onAdd(comId, product)}>
                      {' '}
                      <span className="material-icons">add</span>
                    </Button>
                    <div className={'number'}>{product.quantity}</div>
                    <Button
                      className={' thisiscarda'}
                      onClick={() => onMinus(comId, product)}>
                      {' '}
                      <span className="material-icons">remove</span>
                    </Button>
                  </div>
                </div>
                <div className={'flex-1 txc imgds mr-2 ml-2'}>
                  <Swiper
                    perPage={1}
                    arrows={false}
                    interval={Math.floor(
                      1000 + Math.random() * (5000 - 1000 + 1)
                    )}
                    breakpoints={{
                      1024: {
                        perPage: 1,
                      },
                      768: {
                        perPage: 1,
                      },
                      640: {
                        perPage: 1,
                      },
                      320: {
                        perPage: 1,
                      },
                    }}
                    className={'p-0 m-0'}>
                    {product.photos &&
                      product.photos.map((ph, phk) => {
                        return (
                          <img
                            key={phk}
                            className={'gfdsdf'}
                            src={MainUrl + '/' + ph}
                            alt={product.title?.fa}
                          />
                        );
                      })}
                  </Swiper>
                </div>
                <div className={'flex-8 mr-2'}>
                  <div className={'ttl'}>{product.title[lan]}</div>
                  {product.price && !product.salePrice && (
                    <div className={'prc'}>{returnPrice(product.price)}</div>
                  )}
                  {product.price && product.salePrice && (
                    <div className={'prc'}>
                      {returnPrice(product.salePrice)}
                      <del className={'ml-2'}>{returnPrice(product.price)}</del>
                    </div>
                  )}
                </div>
                <div className={'flex-1'}>
                  <Button
                    className={'notred smallx'}
                    onClick={() => onDelete(comId, product)}>
                    {' '}
                    <span className="material-icons">delete</span>
                  </Button>
                </div>
              </ListGroupItem>
            );
          })}
      </div>
      <div className={'fdsdf pl-3 pr-3'} onClick={handleToggleCardbar}>
        {Object.keys(cart ?? {}).length && (
          <Link
            to={'/checkout'}
            className={
              'go-to-checkout ml-auto ffgg btn btn-accent btn-lg mt-4 posrel textAlignLeft'
            }>
            <span className={'gfdfghj'}>{t('Checkout')}</span>
            {returnTotalPrice(cart) ? (
              <span className={'juytrftyu'}>
                <span className={'ttl gtrf'}>{returnTotalPrice(cart)}</span>
              </span>
            ) : null}
          </Link>
        )}
        {!Object.keys(cart ?? {}).length && (
          <Button
            onClick={() => handleToast}
            // to={'/'}
            className={
              'go-to-checkout-without-items ml-auto ffgg btn btn-accent btn-lg mt-4 posrel textAlignLeft'
            }>
            <span className={'gfdfghj'}>{t('Checkout')}</span>
            {returnTotalPrice(cart) ? (
              <span className={'juytrftyu'}>
                <span className={'ttl gtrf'}>{returnTotalPrice(cart)}</span>
              </span>
            ) : null}
          </Button>
        )}
      </div>
    </Col>
  );
};
export default withTranslation()(CardSidebar);
