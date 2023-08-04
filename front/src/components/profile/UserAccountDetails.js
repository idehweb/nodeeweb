import React from 'react';

import {Button, Card, CardHeader, Col, Form, FormInput, ListGroup, ListGroupItem, Row,} from 'shards-react';
import {withTranslation} from 'react-i18next';
import store from '#c/functions/store';
import {Logout, submitProfile} from '#c/functions/index';
import {Navigate} from 'react-router-dom';
import { toast } from "react-toastify";

// const UserAccountDetails  = ({ title }) => (
class LoginForm extends React.PureComponent {
  constructor(props) {
    super(props);
    let st = store.getState().store.user;
    this.state = {
      phoneNumber: st.phoneNumber,
      firstName: st.firstName,
      lastName: st.lastName,
      email: st.email,
      internationalCode: st.internationalCode,
    };
  }

  submitForm = () => {
    const {phoneNumber, firstName, lastName, internationalCode,email} = this.state;
    const {t} = this.props;
    if (phoneNumber) {
      submitProfile({
        phoneNumber,
        firstName,
        lastName,
        email,
        internationalCode,
      }).then((d) => {
        toast(t("successfully done!"), {
          type: "success"
        });
        return;
      });
    }
  };

  render() {
    const {phoneNumber, firstName, lastName, internationalCode,email} = this.state;
    const {title, t} = this.props;
    console.log('internationalCode',firstName , lastName ,email, internationalCode,!(firstName && lastName && internationalCode));
    if (!(firstName && lastName && internationalCode)) {
      return <Navigate to={'/login/'}/>;

    }
    return (
      <Card small={'true'} className="mb-4">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
        </CardHeader>
        <ListGroup flush>
          <ListGroupItem className="p-3">
            <Row>
              <Col>
                <Form>
                  <Row form className={'row'}>
                    {/* First Name */}
                    <Col md="6" className="form-group">
                      <label htmlFor="feFirstName">{t('name')}</label>
                      <FormInput
                        id="feFirstName"
                        placeholder={t('name')}
                        value={firstName}
                        onChange={(event) => {
                          this.setState({
                            firstName: event.target.value,
                          });
                        }}
                      />
                    </Col>
                    {/* Last Name */}
                    <Col md="6" className="form-group">
                      <label htmlFor="feLastName">{t('last name')}</label>
                      <FormInput
                        id="feLastName"
                        placeholder={t('last name')}
                        value={lastName}
                        onChange={(event) => {
                          this.setState({
                            lastName: event.target.value,
                          });
                        }}
                      />
                    </Col>
                  </Row>
                  <Row form className={'row'}>
                    {/* First Name */}
                    <Col md="6" className="form-group">
                      <label htmlFor="feFirstName">{t('International Code')}</label>
                      <FormInput
                        id="juyghj"
                        placeholder={t('00xxxxxxxx')}
                        value={internationalCode}
                        onChange={(event) => {
                          this.setState({
                            internationalCode: event.target.value,
                          });
                        }}
                      />
                    </Col>
                    {/* Last Name */}
                    <Col md="6" className="form-group">
                      <label htmlFor="feFirstName">{t('Email')}</label>
                      <FormInput
                        id="juyghj"
                        placeholder={t('example@gmail.com')}
                        value={email}
                        onChange={(event) => {
                          this.setState({
                            email: event.target.value,
                          });
                        }}
                      />
                    </Col>
                  </Row>
                  <Row form className={'row'}>
                    {/* Password */}
                    <Col md="12" className="form-group">
                      <label htmlFor="feLastName">{t('phone number')}</label>
                      <FormInput
                        placeholder={t('phone number')}
                        value={phoneNumber}
                        disabled
                        onChange={(event) => {
                          this.setState({
                            phoneNumber: event.target.value,
                          });
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="mgt10"></Col>
                  </Row>
                  <Row className={'row'}>
                    <Col>
                      <Button theme="accent" onClick={this.submitForm}>
                        {t('update')}
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        theme="error"
                        className="dfg ml-2"
                        onClick={Logout}>
                        {t('logout')}
                      </Button>
                    </Col>
                  </Row>


                </Form>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
      </Card>
    );
  }
}

export default withTranslation()(LoginForm);
