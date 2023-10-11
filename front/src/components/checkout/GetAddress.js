import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Row,
} from 'shards-react';

import store from '#c/functions/store';
import CustomModal from '#c/components/Modal';
import CreateForm from '#c/components/components-overview/CreateForm_old';
// import CreateForm from "#c/components/form/CreateForm";
import { withTranslation } from 'react-i18next';
import {
  SaveData,
  buy,
  changeAddressArr,
  createOrder,
  getTheChaparPrice,
  getTheSettings,
  goToProduct,
  savePost,
  updateAddress,
  updateCard,
} from '#c/functions/index';
import { toast } from 'react-toastify';
import State from '#c/data/state.json';
import City from '#c/data/city.json';
import UserService from '@/functions/User';

function setCity(s) {
  let tttt = [];
  City().forEach((item) => {
    if (item.state_no == s) {
      tttt.push(item);
    }
  });
  return tttt;
}

function GetAddress(props) {
  const { t } = props;
  let [checkOutBillingAddress, setcheckOutBillingAddress] = useState({
    add: {
      data: UserService.getMeLocal().user?.address?.[hover] ?? {},
      fields: [
        // state
        {
          type: 'selectOption',
          label: t('State'),
          returnEverything: false,
          size: {
            sm: 6,
            lg: 6,
          },
          onChange: (text) => {
            checkOutBillingAddress.add.data['state'] = text;
            checkOutBillingAddress.add.fields[1].children = setCity(text);
          },
          selectOptionText: t('choose state...'),
          className: 'rtl',
          placeholder: t('State'),
          child: [],
          children: State(),
          value: UserService.getMeLocal().user?.address?.[hover]?.state || '',
        },
        // city
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
            checkOutBillingAddress.add.data['city'] = text.name;
          },
          selectOptionText: t('choose city...'),
          className: 'rtl',
          placeholder: t('City'),
          child: [],
          children: City(),
          value: UserService.getMeLocal().user?.address?.[hover]?.city || '',
        },
        // street
        {
          type: 'textarea',
          label: t('Address'),

          size: {
            sm: 12,
            lg: 12,
          },
          onChange: (text) => {
            checkOutBillingAddress.add.data['street'] = text;
          },
          className: 'rtl',
          placeholder: t('Street Address details'),
          child: [],
          id: 'mytextarea',
          value: UserService.getMeLocal()?.user?.address?.[hover]?.street || '',
        },
        // postal code
        {
          type: 'number',
          label: t('Postal Code'),

          size: {
            sm: 12,
            lg: 12,
          },
          onChange: (text) => {
            checkOutBillingAddress.add.data['postalCode'] = text;
          },
          className: 'ltr',
          placeholder: t('postal code'),
          child: [],
          value:
            UserService.getMeLocal()?.user?.address?.[hover]?.postalCode || '',
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
            if (!checkOutBillingAddress.add.data.street) {
              toast(t('Enter street address!'), {
                type: 'error',
              });
              return;
            }
            if (!checkOutBillingAddress.add.data.state) {
              toast(t('Enter state!'), {
                type: 'error',
              });
              return;
            }
            if (!checkOutBillingAddress.add.data.city) {
              toast(t('Enter city!'), {
                type: 'error',
              });
              return;
            }
            if (!checkOutBillingAddress.add.data.postalCode) {
              toast(t('Enter postal code!'), {
                type: 'error',
              });
              return;
            }
            checkOutBillingAddress.add.fields.forEach((m, x) => {
              checkOutBillingAddress.add.fields[x].value = '';
            });

            try {
              const response = await updateAddress(
                checkOutBillingAddress.add.data,
              );
              setAddress(response.address);
              setModals(false);
            } catch (err) {
              toast.error(err.response?.data?.message || err.message);
            }
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
            onCloseModal();
          },
        },
      ],
    },
  });
  const [address, setAddress] = useState(
    store.getState().store.user?.address || [],
  );
  let [addressDelModal, setAddressDelModal] = useState(null);
  let [deletModals, setDeletModals] = useState(false);
  let [hover, setHover] = useState(store.getState().store.address_hover ?? 0);
  let [modals, setModals] = useState(false);

  const onCloseDeletModals = () => {
    setDeletModals(!deletModals);
  };

  const deleteThisAdd = async (ad) => {
    if (!deletModals) {
      setDeletModals(!deletModals);
      setAddressDelModal(ad);
    } else {
      if (!address?.length) return;
      let arr = [];
      address.forEach((item, itemx) => {
        if (addressDelModal !== itemx) arr.push(item);
      });
      try {
        await changeAddressArr(arr, (code) => code <= 400);
        setHover(0);
        setAddress(arr);
        setDeletModals(!deletModals);
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      }
    }
  };

  const hoverThis = (ad) => {
    setHover(ad);
  };

  const onCloseModal = () => {
    setModals((m) => {
      return !m;
    });
  };

  const { _id, onNext, onPrev } = props;

  return (
    <Card className="mb-3 pd-1">
      <CardHeader className={'pd-1'}>
        <div className="kjhghjk">
          <div
            className="d-inline-block item-icon-wrapper ytrerty"
            dangerouslySetInnerHTML={{ __html: t('Address') }}
          />
          <span>
            <Button
              className={'floatR mt-2'}
              onClick={() => {
                onCloseModal();
              }}>
              {'+ ' + t('Add')}
            </Button>
          </span>
        </div>
      </CardHeader>
      <CardBody className={'pd-1'}>
        <Col lg="12">
          <Row className={'mt-4'}>
            <CustomModal
              onClose={() => {
                onCloseModal();
              }}
              open={modals}
              className={'width50vw sdfghyjuikol kiuytgfhjuyt'}
              title={t('Add new address')}>
              <CreateForm
                buttons={checkOutBillingAddress.add.buttons}
                fields={checkOutBillingAddress.add.fields}
              />
            </CustomModal>
            {address &&
              address.map((adr, ad) => {
                let hoverS = '';
                if (ad === hover) {
                  hoverS = 'hover';
                }

                return (
                  <Col
                    key={ad}
                    md={12}
                    lg={12}
                    sm={12}
                    className={'hoveraddress'}
                    onClick={() => {
                      hoverThis(ad);
                    }}>
                    <div className={'radio-button ' + hoverS}></div>
                    <div className={'theadds mb-3 posrel ' + hoverS}>
                      {/*<div className={'white p-2'}>*/}
                      <div className={'ttl'}>{adr.postalCode}</div>
                      <div className={'desc'}>
                        {adr.state} - {adr.city} - {adr.street}
                      </div>
                      <div className={' d-flex posab bilar'}>
                        <div className={'flex-1 pl-2 textAlignRight theb'}>
                          <span
                            className="material-icons circle-button red"
                            onClick={() => {
                              deleteThisAdd(ad);
                            }}>
                            close
                          </span>
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })}
            <CustomModal
              onClose={() => {
                onCloseDeletModals();
              }}
              open={deletModals}
              className={'width50vw sdfghyjuikol uyirtfgyhyu8y7t6'}
              title={t('Delete address?')}>
              <Card style={{ width: '100%' }}>
                <CardBody>
                  <div>از حذف این آدرس مطمئن هستید؟</div>
                </CardBody>
                <CardFooter>
                  <Button
                    className={'btn-danger'}
                    block
                    onClick={() => {
                      deleteThisAdd(null);
                    }}>
                    {t('Yes, Delete')}
                  </Button>
                  <Button
                    className={''}
                    block
                    onClick={() => {
                      onCloseDeletModals();
                    }}>
                    {t('No')}
                  </Button>
                </CardFooter>
              </Card>
            </CustomModal>
          </Row>
        </Col>
      </CardBody>
      <CardFooter className={'pd-1'}>
        <ButtonGroup size="sm left">
          <Button
            className={'back-to-checkout-part-information'}
            left={'true'}
            onClick={onPrev}>
            <i className="material-icons">{'chevron_right'}</i>
            {t('prev')}
          </Button>
          <Button
            className={'go-to-checkout-part-delivery'}
            left={'true'}
            onClick={() => {
              if (!address[hover]) {
                toast(t('Choose address!'), {
                  type: 'error',
                });
                return;
              } else {
                SaveData({ address_hover: hover });
                onNext(address[hover]);
              }
            }}>
            {t('next')}
            <i className="material-icons">{'chevron_left'}</i>
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
  // }
}

export default withTranslation()(GetAddress);
