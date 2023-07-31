import React from "react";
import {Button,ButtonGroup, Card, CardBody, CardFooter, CardHeader, Col, Row} from "shards-react";

import store from "#c/functions/store";
// import State from "#c/data/state";
import CreateForm from "#c/components/form/CreateForm";
import {withTranslation} from 'react-i18next';
import {
  buy,
  changeAddressArr,
  createOrder,
  getTheChaparPrice,
  getTheSettings,
  goToProduct,
  savePost,
  updateAddress,
  updateCard
} from "#c/functions/index"
import {toast} from "react-toastify";

class GetInformation extends React.Component {
  constructor(props) {
    super(props);
    const {t} = props;
    this.state = {
      lan: store.getState().store.lan || 'fa',
      card: store.getState().store.card || [],

      token: store.getState().store.user.token || '',
      user: store.getState().store.user || {},
      checkOutPhoneNumber: {
        add: {
          data: {
            firstName: store.getState().store.firstName || '',
            lastName: store.getState().store.lastName || '',
            internationalCode: store.getState().store.internationalCode || '',
            email: store.getState().store.email || '',
            phoneNumber: store.getState().store.user.phoneNumber || '',
            SecondPhoneNumber: '',
          },
          fields: [
            {
              type: 'input',
              label: t('Phone number'),

              size: {
                sm: 12,
                lg: 6,
              },
              onChange: (text) => {
                this.state.checkOutPhoneNumber.add.data['phoneNumber'] = text;
              },
              className: 'ltr',
              placeholder: '0912*******',
              child: [],
              disabled: true,
              value: store.getState().store.user.phoneNumber || '',
            },
            {
              type: 'input',
              label: t('Second Phone number'),

              size: {
                sm: 12,
                lg: 6,
              },
              onChange: (text) => {
                this.state.checkOutPhoneNumber.add.data['SecondPhoneNumber'] = text;
              },
              className: 'ltr',
              placeholder: t('Additional phone number'),
              child: [],
              disabled: false,
              value: store.getState().store.user.SecondPhoneNumber || '',
            },
            {
              type: 'input',
              label: t('First name'),

              size: {
                sm: 12,
                lg: 6,
              },
              onChange: (text) => {
                this.state.checkOutPhoneNumber.add.data['firstName'] = text;
                let user = this.state.user.firstName = text;
                savePost(user);
              },
              className: 'rtl',
              placeholder: t('First name'),
              child: [],
              disabled: false,
              value: store.getState().store.user.firstName || '',
            },
            {
              type: 'input',
              label: t('Last name'),

              size: {
                sm: 12,
                lg: 6,
              },
              onChange: (text) => {
                this.state.checkOutPhoneNumber.add.data['lastName'] = text;
                let user = this.state.user.lastName = text;
                savePost(user);
              },
              className: 'rtl',
              placeholder: t('Last name'),
              child: [],
              disabled: false,
              value: store.getState().store.user.lastName || '',
            },
            {
              type: 'input',
              label: t('International Code'),

              size: {
                sm: 12,
                lg: 6,
              },
              onChange: (text) => {
                this.state.checkOutPhoneNumber.add.data['internationalCode'] = text;
                let user = this.state.user.internationalCode = text;
                savePost(user);
              },
              className: 'ltr',
              placeholder: '00xxxxxxxx',
              child: [],
              disabled: false,
              value: store.getState().store.user.internationalCode || '',
            },
            {
              type: 'input',
              label: t('Email'),

              size: {
                sm: 12,
                lg: 6,
              },
              onChange: (text) => {
                this.state.checkOutPhoneNumber.add.data['email'] = text;
                let user = this.state.user.email = text;
                savePost(user);
              },
              className: 'ltr',
              placeholder: 'mail@gmail.com',
              child: [],
              disabled: false,
              value: store.getState().store.user.email || '',
            },

            {
              type: 'empty',
              size: {
                sm: 12,
                lg: 12,
              },
              className: 'height50',
              placeholder: '',
              child: [],
            },
          ],
          buttons: [],
        },
      }
    };
    // this.getSettings();
  }


  render() {
    const {t, _id,onNext,card} = this.props;
    // let sum = 0;
    let {checkOutPhoneNumber} = this.state;

    return (
      <Card className="mb-3 pd-1">
        <CardHeader className={'pd-1'}>
          <div className="kjhghjk">
            <div
              className="d-inline-block item-icon-wrapper ytrerty"
              dangerouslySetInnerHTML={{__html: t('Contact number')}}
            />
          </div>
        </CardHeader>
        <CardBody className={'pd-1'}>
          <Col lg="12">
            <Row>
              <CreateForm
                fields={{
                  firstName: this.state.user.firstName || '',
                  lastName: this.state.user.lastName || '',
                  internationalCode: this.state.user.internationalCode || '',
                  email: this.state.user.email || '',
                  phoneNumber: this.state.user.phoneNumber || '',
                  SecondPhoneNumber: '',
                }}
                onSubmit={()=>{}}
                buttons={[]}
                rules={{fields:[
                  {"name":"firstName","label":t("First name"),"type":"string"},
                  {"name":"lastName","label":t("Last name"),"type":"string"},
                  {"name":"internationalCode","label":t("International Code"),"type":"string"},
                  {"name":"email","label":t("Email"),"type":"string"},
                  {"name":"phoneNumber","label":t("Phone number"),"type":"string"},
                  {"name":"SecondPhoneNumber","label":t("Second Phone number"),"type":"string"},
                ]}}
                // fields={checkOutPhoneNumber.add.fields}
              />
            </Row>
          </Col>
        </CardBody>
        <CardFooter className={'pd-1'}>
          <ButtonGroup size="sm left">
            <Button className={''} left={'true'} onClick={()=>{
              this.state.card=store.getState().store.card;
              console.log(' this.state.card', this.state.card);
              if (!this.state.card || (this.state.card && !this.state.card[0])) {
                toast(t('you have nothing in your cart!'), {
                  type: 'error'
                });
                return;
              }else{onNext()}}}>{t('next')}<i className="material-icons">{'chevron_left'}</i></Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    );
  }
}

export default withTranslation()(GetInformation);
