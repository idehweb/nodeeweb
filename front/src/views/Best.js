import React from 'react';

import {Col, Container, Row} from 'shards-react';
import {
  slide1Img,
  slide2Img,
  slide3Img,
  slide4Img,
  slide5Img,
  slideOffer1Img,
  slideOffer2Img,
  slideOffer3Img,
  slideOffer4Img,
  slideOffer5Img,
  slideOffer6Img,
  valentineDays
} from '#c/assets/index';

// Import Swiper styles
import {enableAdmin, enableAgent, enableSell, getPosts, getPostsByCat, setCountry,} from '#c/functions/index';

import {withTranslation} from 'react-i18next';
import Story from '#c/components/Home/Story';

const Best = ({match, location, history, t}) => {

  return (
    <Container fluid className="main-content-container fghjkjhgf">
      <Row className="relative mt-3 mb-3">
        <Col>
          <Story className={'cube'}/>
        </Col>
      </Row>
    </Container>
  );
};

export default withTranslation()(Best);
