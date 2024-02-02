import GetDelivery from '@/components/checkout/GetDelivery';
import { Col, Row } from 'shards-react';

function CheckoutPost({ onNext, onPrev, onSetData,setdeliveryPrice,setTotal,setSum,onChooseDelivery }) {
  console.log('setdeliveryPrice setdeliveryPrice',setdeliveryPrice,setTotal,setSum)
  return (
    <Row>
      ddddd
      <Col lg="2"></Col>
      <Col lg="8">
        <GetDelivery
          setdeliveryPrice={(e)=>setdeliveryPrice(e)}
          onNext={onNext}
          onChooseDelivery={onSetData}
          onPrev={onPrev}
          setTotal={setTotal}
          setSum={setSum}
          // onChooseDelivery={onChooseDelivery}
        />
      </Col>
      <Col lg="2"></Col>
    </Row>
  );
}

export default CheckoutPost;
