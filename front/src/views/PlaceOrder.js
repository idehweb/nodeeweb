import React from 'react';
import { Container, Row, Col } from 'shards-react';
import { CircularProgress } from '@mui/material';

import { withTranslation } from 'react-i18next';
import { PlaceOrderF } from '../functions/index';

import { Navigate } from 'react-router-dom';

class PlaceOrder extends React.Component {
  constructor(props) {
    super(props);
    window.scrollTo(0, 0);
    this.state = {
      redirect: null,
    };
    // let {_id} = this.params;
    if (props && props.match && props.match.params && props.match.params._id) {
      PlaceOrderF(props.match.params._token, props.match.params._id).then(
        (d) => {
          if (d && d.success && d.url) {
            window.location.replace(d.url);
          }
        }
      );
    }
  
  }

  render() {
    let { t } = this.props;

    let { redirect } = this.state;
    if (redirect) {
      return <Navigate to={redirect} push={false} exact={true} />;
    } else {
      return (
        <Container fluid className="main-content-container px-4">
          <Row noGutters className="page-header py-4"></Row>
          <Row>
            {/*<Col lg="4">*/}
            {/*<UserDetails />*/}
            {/*</Col>*/}
            <Col lg="3"></Col>
            <Col lg="6">
              <Row>
                {/*<Col lg="12">*/}
                <div className={'d-block marginAuto'}>
                  <CircularProgress
                    disableShrink
                    className={'d-block marginAuto'}
                  />
                  <div className={'d-block marginAuto mT20'}>
                    {t('redirecting...')}
                  </div>
                </div>
                {/*</Col>*/}
              </Row>
            </Col>
            <Col lg="3"></Col>
          </Row>
        </Container>
      );
    }
  }
}

export default withTranslation()(PlaceOrder);
