import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'shards-react';
import { useNavigate, useParams } from 'react-router-dom';

import PageTitle from '../components/common/PageTitle';
import GetInformation from '#c/components/checkout/GetInformation';
import GetAddress from '#c/components/checkout/GetAddress';
import GetDelivery from '#c/components/checkout/GetDelivery';
import LastPart from '#c/components/checkout/LastPart';
import { useTranslation, withTranslation } from 'react-i18next';
import { buy, createOrder, isClient, updatetStatus } from '../functions/index';
import store from '../functions/store';
import { toast } from 'react-toastify';
import _ from 'underscore';
import { useSelector } from 'react-redux';

function Checkout(props) {
  const { t } = useTranslation();
  let [page, setPage] = useState('2');
  let [the_address, setThe_address] = useState({});
  let [amount, setAmount] = useState(0);
  let [sum, setSum] = useState(0);
  let [setting, setSetting] = useState({});
  let [discount, setDiscount] = useState('');
  let [discountCode, setdiscountCode] = useState('');
  let [deliveryPrice, setdeliveryPrice] = useState('');
  const themeData = useSelector((st) => st.store.themeData, _.isEqual);

  return (
    <Container fluid className="main-content-container px-4 maxWidth1200">
      <Row noGutters className="page-header py-4">
        <PageTitle
          title={t('Submit order')}
          subtitle={t('order details')}
          md="12"
          className="ml-sm-auto mr-sm-auto"
        />
      </Row>
      {page == '1' && (
        <Row>
          <Col lg="2"></Col>
          <Col lg="8">
            <GetInformation onNext={() => goNext('2')} />
          </Col>
          <Col lg="2"></Col>
        </Row>
      )}
      {page == '2' && (
        <Row>
          <Col lg="2"></Col>
          <Col lg="8">
            <GetAddress
              onNext={() => goNext('3')}
              onSetAddress={(params) => onSetAddress(params)}
              onPrev={() => goNext('1')}
            />
          </Col>
          <Col lg="2"></Col>
        </Row>
      )}
      {page == '3' && (
        <Row>
          <Col lg="2"></Col>
          <Col lg="8">
            <GetDelivery
              onNext={() => goNext('4')}
              onChooseDelivery={(params) => {
                onChooseDelivery(params);
              }}
              addressChoosed={the_address}
              onPrev={() => goNext('2')}
            />
          </Col>
          <Col lg="2"></Col>
        </Row>
      )}
      {page == '4' && (
        <Row>
          <Col lg="2"></Col>
          <Col lg="8">
            <LastPart
              onPrev={() => goNext('3')}
              onPlaceOrder={(e) => {
                placeOrder(e);
              }}
              theParams={{
                sum,
                discount,
                discountCode,
                amount,
                // tax: (themeData && themeData.tax) ? themeData.tax : 0,
                deliveryPrice,
                address: the_address,
                setting,
                setPaymentMethod: (e) => {
                  console.log('setPaymentMethod', e);
                  setThePaymentMethod(e);
                },
                setamount: (e) => {
                  console.log('setTheAmount', e);
                  setTheAmount(e);
                },
                setDiscount: (e, d = '') => {
                  console.log('setDiscount', e, d);
                  setTheDiscount(e, d);
                },
              }}
            />
          </Col>
          <Col lg="2"></Col>
        </Row>
      )}
    </Container>
  );
}

export default withTranslation()(Checkout);
