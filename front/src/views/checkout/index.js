import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Col, Container, Row } from 'shards-react';
import { useParams } from 'react-router-dom';
import PageTitle from '../../components/common/PageTitle';
import { withTranslation } from 'react-i18next';
import CheckoutAddress from './Address';
import CheckoutPost from './Post';
import CheckoutFactor from './Factor';

const CheckoutState = {
  Address: 'address',
  Post: 'post',
  Factor: 'factor',
};

function Checkout({ t }) {
  const params = useParams();
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
        case CheckoutState.Address:
          return setData((data) => ({ ...data, address: newData }));
        case CheckoutState.Post:
          return setData((data) => ({ ...data, post: newData }));
        case CheckoutState.Factor:
          return setData((data) => ({ ...data, ...newData }));
      }
    },
    [state],
  );

  const bodyCreator = () => {
    switch (state) {
      case CheckoutState.Address:
        return (
          <CheckoutAddress
            onNext={onNext}
            onPrev={onPrev}
            onSetData={onSetData}
          />
        );
      case CheckoutState.Post:
        return (
          <CheckoutPost
            onNext={onNext}
            onPrev={onPrev}
            onSetData={onSetData}
            address={data.address}
          />
        );
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
