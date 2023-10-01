import LastPart from '@/components/checkout/LastPart';
import { Col, Row } from 'shards-react';

function CheckoutFactor({ onNext, onPrev, data }) {
  return (
    <Row>
      <Col lg="2"></Col>
      <Col lg="8">
        <LastPart onPrev={onPrev} onPlaceOrder={onNext} theParams={data} />
      </Col>
      <Col lg="2"></Col>
    </Row>
  );
}

export default CheckoutFactor;
