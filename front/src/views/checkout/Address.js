import GetAddress from '@/components/checkout/GetAddress';
import { Col, Row } from 'shards-react';

function CheckoutAddress({ onNext, onPrev }) {
  return (
    <Row>
      <Col lg="2"></Col>
      <Col lg="8">
        <GetAddress onNext={onNext} onPrev={onPrev} />
      </Col>
      <Col lg="2"></Col>
    </Row>
  );
}

export default CheckoutAddress;
