/* eslint-disable default-case */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Col, Container, Row } from 'shards-react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import PageTitle from '../../components/common/PageTitle';
import { withTranslation } from 'react-i18next';
import CheckoutAddress from './Address';
import CheckoutPost from './Post';
import CheckoutFactor from './Factor';
import OrderViewValidation from '@/functions/order/validation';
import { OrderUtils } from '@/functions/order/utils';
import { CartService } from '@/functions/order/cart';
import UserService from '@/functions/User';
import { toast } from 'react-toastify';

const CheckoutState = {
  Address: 'address',
  Post: 'post',
  Factor: 'factor',
};

function Checkout({ t }) {
  const navigate = useNavigate();
  const params = useParams();
  const [query] = useSearchParams();
  const [state, setState] = useState(params?.state || CheckoutState.Address);
  const [data, setData] = useState({});

  const onNext = useCallback(() => {
    switch (state) {
      case CheckoutState.Address:
        return setState(CheckoutState.Post);
      case CheckoutState.Post:
        return setState(CheckoutState.Factor);
      case CheckoutState.Factor:
        break;
    }
  }, [state]);
  const onPrev = useCallback(() => {
    switch (state) {
      case CheckoutState.Post:
        return setState(CheckoutState.Address);
      case CheckoutState.Factor:
        return setState(CheckoutState.Post);
    }
  }, [state]);
  const onSetData = useCallback(
    (newData) => {
      switch (state) {
        case CheckoutState.Post:
          return setData((data) => ({ ...data, post: newData }));
        case CheckoutState.Factor:
          return setData((data) => ({ ...data, ...newData }));
      }
    },
    [state]
  );

  useEffect(() => {
    const user = UserService.getMeLocal(null);
    if (!user?._id)
      return navigate(
        `/login?check=false&redirect=${encodeURIComponent('/checkout')}`,
        { replace: true }
      );

    switch (state) {
      case CheckoutState.Address:
        if (!OrderViewValidation.address()) return history.back();
        break;
      case CheckoutState.Post:
        if (!OrderViewValidation.post()) {
          navigate(`/checkout/${CheckoutState.Address}`, { replace: true });
          setState(CheckoutState.Address);
          return;
        }
        break;
      case CheckoutState.Factor:
        if (!OrderViewValidation.factor()) {
          navigate(`/checkout/${CheckoutState.Post}`, { replace: true });
          setState(CheckoutState.Post);
          return;
        }

        break;
    }
    navigate(`/checkout/${state}`);
  }, [state]);

  useEffect(() => {
    // const from = query.get('from');
    // if (from !== '/login') return;
    CartService.sync().catch((err) => {
      CartService.clear();
      toast.error(
        err.response?.status === 400
          ? 'some products change'
          : 'there is some problem',
        {
          autoClose: true,
          closeOnClick: true,
        }
      );
      setTimeout(() => {
        return navigate('/', { replace: true });
      }, 1500);
    });
  }, []);

  const bodyCreator = () => {
    switch (state) {
      case CheckoutState.Address:
        return <CheckoutAddress onNext={onNext} onPrev={onPrev} />;
      case CheckoutState.Post:
        return <CheckoutPost onNext={onNext} onPrev={onPrev} />;
      case CheckoutState.Factor:
        return (
          <CheckoutFactor
            onNext={onNext}
            onPrev={onPrev}
            onSetData={onSetData}
            data={data}
          />
        );
    }
  };

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
      {bodyCreator()}
    </Container>
  );
}

export default withTranslation()(Checkout);
