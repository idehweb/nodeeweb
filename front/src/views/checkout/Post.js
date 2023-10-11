import GetDelivery from '@/components/checkout/GetDelivery';
import { Col, Row } from 'shards-react';

function CheckoutPost({ onNext, onPrev, onSetData }) {
  return (
    <Row>
      <Col lg="2"></Col>
      <Col lg="8">
        <GetDelivery
          onNext={onNext}
          onChooseDelivery={onSetData}
          onPrev={onPrev}
        />
      </Col>
      <Col lg="2"></Col>
    </Row>
  );
}

export default CheckoutPost;
