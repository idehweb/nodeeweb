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
import LoadingComponent from '#c/components/components-overview/LoadingComponent';

import store from '#c/functions/store';
import { useTranslation, withTranslation } from 'react-i18next';
import { getTheSettings } from '#c/functions/index';

function GetDelivery({ address, ...props }) {
  console.log('##$$', address);
  const { t } = useTranslation();
  let [renTimes, setRenTimes] = useState([]);
  let [loading, setLoading] = useState(false);
  let [loading2, setLoading2] = useState(false);
  let [hoverD, setHoverD] = useState(0);
  useEffect(() => {
    getSettings();
  }, []);

  const countDelivery = (sum, renTimes, hoverD = 0) => {
    return new Promise(function (resolve, reject) {
      let varprice = 0;

      let setting = renTimes[hoverD];

      if (setting && setting.condition) {
        if (parseInt(setting.condition) > sum) {
          if (setting.priceLessThanCondition)
            if (setting.priceLessThanCondition == '0') {
              varprice = 0;
            } else {
              varprice = setting.priceLessThanCondition;
            }
        }
        if (parseInt(setting.condition) < sum) {
          if (setting.priceMoreThanCondition)
            if (setting.priceMoreThanCondition == '0') {
              varprice = 0;
            } else {
              varprice = setting.priceMoreThanCondition;
            }
        }
      }
      let total = parseInt(sum) + parseInt(varprice);
      resolve({ deliveryPrice: varprice, total: total });
    });
  };

  const getSettings = () => {
    getTheSettings().then((res) => {
      if (!res || (res && !res.length)) {
        props.onNext();
      } else {
        setSettings(res);
        calculateAddress(res, hoverD, address)
          .then((obj) => {
            setRenTimes(obj);
            setLoading(true);
          })
          .catch((e) => console.error('e', e));
      }
    });
  };

  const countSum = (card) => {
    return new Promise(function (resolve, reject) {
      let ttt = 0;
      if (card && card.length > 0)
        card.forEach((item, idx2) => {
          if (item.salePrice) {
            ttt += item.salePrice * item.count;
          } else if (item.price && !item.salePrice) {
            ttt += item.price * item.count;
          }
        });
      resolve(ttt);
    });
  };

  const chooseDelivery = (obj) => {
    let { onChooseDelivery } = props;

    return new Promise(function (resolve, reject) {
      onChooseDelivery(obj);
      resolve(obj);
    });
  };

  const hoverThisD = (ad, renTimes) => {
    countSum(card).then((sum) => {
      countDelivery(sum, renTimes, ad).then((obj) => {
        setDeliveryPrice(obj.deliveryPrice);
        setTotal(obj.total);
        setSum(sum);
        setHoverD(ad);
        setLoading2(true);
        chooseDelivery({
          setting: renTimes[ad],
          deliveryPrice: obj.deliveryPrice,
          total: obj.total,
          sum: sum,
          hoverD: ad,
        });
      });
    });
  };

  const calculateAddress = (settings, hoverD = hoverD, address = address) => {
    let renTimes = [];

    return new Promise(function (resolve, reject) {
      if (!address) return reject({});
      if (settings && settings.length > 0) {
        settings.forEach((adr, ad) => {
          if (adr.is === 'is') {
            if (
              address.State == adr.city &&
              supportedcity.indexOf(address.City) > -1
            ) {
              renTimes.push(adr);
            }
          } else if (adr.is === 'isnt') {
            if (address && address.State && address.State != adr.city) {
              renTimes.push(adr);
            } else if (
              address &&
              address.State &&
              address.State == adr.city &&
              !(supportedcity.indexOf(address.City) > -1)
            ) {
              renTimes.push(adr);
            }
          } else {
            renTimes.push(adr);
          }
        });
        hoverThisD(0, renTimes);

        resolve(renTimes);
      }
    });
  };

  const { _id, onNext, onPrev } = props;
  const loader = (
    <div className="loadNotFound loader " key={23}>
      {t('loading...')}
      <LoadingComponent height={30} width={30} type="spin" color="#3d5070" />
    </div>
  );
  const loader2 = (
    <div className="loadNotFound loader " key={23}>
      <LoadingComponent height={30} width={30} type="spin" color="#3d5070" />
    </div>
  );
  return (
    <Card className="mb-3 pd-1">
      <CardHeader className={'pd-1'}>
        <div className="kjhghjk">
          <div
            className="d-inline-block item-icon-wrapper ytrerty"
            dangerouslySetInnerHTML={{ __html: t('Delivery Schedule') }}
          />
        </div>
      </CardHeader>
      <CardBody className={'pd-1'}>
        <Col lg="12">
          {loading && (
            <Row>
              {renTimes &&
                renTimes.length > 0 &&
                renTimes.map((adr, ad) => {
                  let hoverS = '';
                  if (ad === hoverD) {
                    hoverS = 'hover';
                  }
                  return (
                    <Col
                      className={'mb-3'}
                      key={ad}
                      md={12}
                      lg={12}
                      sm={12}
                      onClick={() => {
                        hoverThisD(ad, renTimes);
                      }}>
                      <div className={'radio-button ' + hoverS}></div>
                      <div className={'theadds uytghui87 ' + hoverS}>
                        <div className={'ttl'}>{adr.title}</div>
                        <div className={'desc'}>{adr.description}</div>
                      </div>
                    </Col>
                  );
                })}
            </Row>
          )}
          {!loading && <Row>{loader}</Row>}
        </Col>
      </CardBody>
      <CardFooter className={'pd-1'}>
        <ButtonGroup size="sm left">
          {!loading2 && <Row>{loader2}</Row>}
          {loading2 && [
            <Button
              key={'xo0'}
              className={'back-to-checkout-part-address'}
              left={'true'}
              onClick={onPrev}>
              <i className="material-icons">{'chevron_right'}</i>
              {t('prev')}
            </Button>,
            <Button
              key={'xo1'}
              className={'go-to-checkout-part-last'}
              left={'true'}
              onClick={onNext}>
              {t('next')}
              <i className="material-icons">{'chevron_left'}</i>
            </Button>,
          ]}
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}

export default withTranslation()(GetDelivery);
