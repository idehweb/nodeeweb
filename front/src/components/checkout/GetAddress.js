import React, {useEffect, useState} from "react";
import {Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Col, Row} from "shards-react";

import store from "#c/functions/store";
import CustomModal from "#c/components/Modal";
import CreateForm from "#c/components/components-overview/CreateForm_old";
// import CreateForm from "#c/components/form/CreateForm";
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
import State from '#c/data/state.json';
import City from '#c/data/city.json';
// import State from "#c/data/state";
let supportedcity = ['اميريه-تهران', 'تهران', 'منطقه 11 پستي تهران', 'منطقه 13 پستي تهران', 'منطقه 14 پستي تهران', 'منطقه 15 پستي تهران', 'منطقه 16 پستي تهران', 'تجريش'];

function setCity(s) {
  console.log('setCity', s);
  let tttt = [];
  City().forEach((item) => {
    if (item.state_no == s) {
      tttt.push(item);
    }
  });
  console.log('set city children:', tttt);
  return tttt;
}

function GetAddress(props) {

// class GetAddress extends React.Component {
//   constructor(props) {
//     super(props);

  const {t, onSetAddress} = props;
  let [checkOutBillingAddress,setcheckOutBillingAddress] = useState({
      add: {
        data: {
          type: store.getState().store.billingAddress.type || '',
          State: store.getState().store.billingAddress.State || '',
          City: store.getState().store.billingAddress.City || '',
          Title: store.getState().store.billingAddress.Title || ''
        },
        fields: [
          {
            type: 'selectOption',
            label: t('State'),
            returnEverything: false,
            size: {
              sm: 6,
              lg: 6,
            },
            onChange: (text) => {

              checkOutBillingAddress.add.data['State'] = text;
              checkOutBillingAddress.add.fields[1].children = setCity(text);
              setcheckOutBillingAddress({...checkOutBillingAddress});

            },
            selectOptionText: t('choose state...'),
            className: 'rtl',
            placeholder: t('State'),
            child: [],
            children: State(),
            value: store.getState().store.billingAddress.State || '',
          },
          {
            type: 'selectOption',
            label: t('City'),
            size: {
              sm: 6,
              lg: 6,
            },
            readValue: 'no',
            returnEverything: true,
            onChange: (text) => {
              // console.clear();
              console.log('text', text);
              checkOutBillingAddress.add.data['City'] = text.name;
              checkOutBillingAddress.add.data['City_no'] = text.no;

            },
            selectOptionText: t('choose city...'),
            className: 'rtl',
            placeholder: t('City'),
            child: [],
            children: City(),
            value: store.getState().store.billingAddress.City || '',
          },
          {
            type: 'textarea',
            label: t('Address'),

            size: {
              sm: 12,
              lg: 12,
            },
            onChange: (text) => {
              checkOutBillingAddress.add.data['StreetAddress'] = text;
              // d=onChange();
            },
            className: 'rtl',
            placeholder: t('Street Address details'),
            child: [],
            id: "mytextarea",
            value: store.getState().store.billingAddress.StreetAddress || '',
          },
          {
            type: 'number',
            label: t('Postal Code'),

            size: {
              sm: 12,
              lg: 12,
            },
            onChange: (text) => {
              checkOutBillingAddress.add.data['PostalCode'] = text;

            },
            className: 'ltr',
            placeholder: t('postal code'),
            child: [],
            value: store.getState().store.billingAddress.PostalCode || '',
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
        buttons: [
          {
            type: 'small',
            header: [],
            body: ['title', 'text'],
            url: '/order/',
            name: t('Save Address'),
            className: 'ml-auto ffgg btn btn-accent btn-lg ',
            parentClass: 'pd-0',
            loader: true,
            size: {
              xs: 6,
              sm: 6,
              md: 6,
              lg: 6,
            },
            onClick: async (e) => {
              let ref = this;
              console.log('this.data', checkOutBillingAddress.add.data);

              if (!checkOutBillingAddress.add.data.StreetAddress) {
                toast(t('Enter street address!'), {
                  type: 'error'
                });
                return;
              }
              if (!checkOutBillingAddress.add.data.State) {
                toast(t('Enter state!'), {
                  type: 'error'
                });
                return;
              }
              if (!checkOutBillingAddress.add.data.City) {
                toast(t('Enter city!'), {
                  type: 'error'
                });
                return;
              }
              if (!checkOutBillingAddress.add.data.PostalCode) {
                toast(t('Enter postal code!'), {
                  type: 'error'
                });
                return;
              }
              // if (!checkOutBillingAddress.add.data.Title) {
              //   toast(t('Enter address title!'), {
              //     type: 'error'
              //   });
              //   return;
              // }
              // if (!checkOutBillingAddress.add.data.PhoneNumber) {
              //   toast(t('Enter phone number!'), {
              //     type: 'error'
              //   });
              //   return;
              // }
              checkOutBillingAddress.add.fields.forEach((m, x) => {
                // console.log('ref.state', ref.state);
                checkOutBillingAddress.add.fields[x].value = '';
              });
              updateAddress(checkOutBillingAddress.add.data).then((response) => {
                // let len=
                onSetAddress(checkOutBillingAddress.add.data);
                if (response.success) {
                  // setState({
                  //   address: response.customer.address,
                  //   modals: false
                  //
                  // });
                  setAddress(response.customer.address)
                  setModals(false);
                  // this.getSettings();
                }
              })

            },
          },
          {
            type: 'small',
            header: [],
            body: ['title', 'text'],
            // url: '/order/',
            name: t('cancel'),
            className: 'col-md-6 ml-auto ffgg btn btn-danger btn-lg',
            parentClass: 'pd-0',

            size: {
              xs: 6,
              sm: 6,
              md: 6,
              lg: 6,
            },
            onClick: async (e) => {
              onCloseModal()


            },
          },

        ],
      },
    })

    let [address, setAddress] = useState(store.getState().store.address || "");
    let [addressDelModal, setAddressDelModal] = useState(null);
    let [deletModals, setDeletModals] = useState(false);
    let [hover, setHover] = useState(0);
    let [modals, setModals] = useState(false);

  // this.getSettings();
  useEffect(() => {
    onSetAddress(address[hover]);

  }, []);

  // }

  const onCloseDeletModals = () => {
    setModals(!modals);

  }

  const deleteThisAdd = (ad) => {

    let {address}=store.getState().store;
    // let { deletModals, addressDelModal} = state;
    if (!deletModals) {
      setDeletModals(!deletModals)
      setAddressDelModal(ad)
    } else {
      if (!address)
        return;
      let arr = [];
      address.forEach((item, itemx) => {
        if (addressDelModal !== itemx)
          arr.push(item);
      })
      changeAddressArr(arr).then((res) => {
        setHover(0)
        setAddress(arr)
        setDeletModals(!deletModals)
        // setState({address: arr, hover: 0, deletModals: !deletModals});

      });
    }
  }

  const hoverThis = (ad) => {
    let {onSetAddress} = props;
    console.log('hoverThis...', ad);

    onSetAddress(address[ad]);
    setHover(ad);

  }

  const onCloseModal = () => {
    setModals(!modals);

  }

  // render() {
  const {_id, onNext, onPrev} = props;
  // let sum = 0;
  // let {modals, address, hover, deletModals} = state;

  return (
    <Card className="mb-3 pd-1">
      <CardHeader className={'pd-1'}>
        <div className="kjhghjk">
          <div
            className="d-inline-block item-icon-wrapper ytrerty"
            dangerouslySetInnerHTML={{__html: t('Address')}}
          />
          <span><Button className={'floatR mt-2'}
                        onClick={() => {
                          onCloseModal()
                        }}>{'+ ' + t('Add')}</Button></span>
        </div>
      </CardHeader>
      <CardBody className={'pd-1'}>
        <Col lg="12">
          <Row className={'mt-4'}>
            <CustomModal onClose={() => {
              onCloseModal()
            }} open={modals} className={'width50vw sdfghyjuikol kiuytgfhjuyt'}
                         title={t('Add new address')}>
              <CreateForm
                buttons={checkOutBillingAddress.add.buttons}
                fields={checkOutBillingAddress.add.fields}/></CustomModal>
            {address && address.map((adr, ad) => {
              let hoverS = '';
              if (ad === hover) {
                hoverS = 'hover';
              }

              return (<Col key={ad} md={12} lg={12} sm={12} className={'hoveraddress'} onClick={() => {
                hoverThis(ad)
              }}>
                <div className={'radio-button ' + hoverS}></div>
                <div className={'theadds mb-3 posrel ' + hoverS}>
                  {/*<div className={'white p-2'}>*/}
                  <div className={'ttl'}>
                    {adr.PostalCode}
                  </div>
                  <div className={'desc'}>


                    {adr.State} - {adr.City} - {adr.StreetAddress}


                  </div>
                  <div className={' d-flex posab bilar'}>

                    <div className={'flex-1 pl-2 textAlignRight theb'}>

                                  <span className="material-icons circle-button red" onClick={() => {
                                    deleteThisAdd(ad)
                                  }}>close</span>

                    </div>

                  </div>

                </div>

              </Col>)
            })
            }
            <CustomModal onClose={() => {
              onCloseDeletModals()
            }} open={deletModals} className={'width50vw sdfghyjuikol uyirtfgyhyu8y7t6'}
                         title={t('Delete address?')}>
              <Card style={{width: '100%'}}>
                <CardBody>
                  <div>از حذف این آدرس مطمئن هستید؟</div>
                </CardBody>
                <CardFooter>
                  <Button className={'btn-danger'} block onClick={() => {
                    deleteThisAdd(null)
                  }}>{t('Yes, Delete')}</Button>
                  <Button className={''} block onClick={() => {
                    onCloseDeletModals()
                  }}>{t('No')}</Button>

                </CardFooter>
              </Card>
            </CustomModal>
          </Row>
        </Col>
      </CardBody>
      <CardFooter className={'pd-1'}>
        <ButtonGroup size="sm left">
          <Button className={'back-to-checkout-part-information'} left={"true"} onClick={onPrev}><i
            className="material-icons">{'chevron_right'}</i>{t('prev')}
          </Button>
          <Button className={'go-to-checkout-part-delivery'} left={"true"} onClick={() => {
            if (!address[hover]) {
              toast(t('Choose address!'), {
                type: 'error'
              });
              return;
            } else {
              console.log('address is ', address[hover]);
              onNext()
            }

          }}>{t('next')}<i
            className="material-icons">{'chevron_left'}</i></Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
  // }
}

export default withTranslation()(GetAddress);
