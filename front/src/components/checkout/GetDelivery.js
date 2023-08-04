import React, {useEffect, useState} from "react";
import {Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Col, Row} from "shards-react";
import LoadingComponent from '#c/components/components-overview/LoadingComponent';

import store from "#c/functions/store";
import {useTranslation, withTranslation} from 'react-i18next';
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
import City from '#c/data/city.json';
// import State from "#c/data/state";
let supportedcity = ['اميريه-تهران', 'تهران', 'منطقه 11 پستي تهران', 'منطقه 13 پستي تهران', 'منطقه 14 پستي تهران', 'منطقه 15 پستي تهران', 'منطقه 16 پستي تهران', 'تجريش'];

function setCity(s) {
  console.log('setCity', s);
  let tttt = [];
  City.forEach((item) => {
    if (item.state_no == s) {
      tttt.push(item);
    }
  });
  console.log('set city children:', tttt);
  return tttt;
}

function GetDelivery(props) {
// class GetDelivery extends React.Component {
//   constructor(props) {

  // super(props);
console.log('props',props)
  const {addressChoosed} = props;
  const {t} = useTranslation();
  console.log('addressChoosed', addressChoosed);
  let [renTimes, setRenTimes] = useState([]);
  let [address, setAddress] = useState(addressChoosed);
  let [card, setCard] = useState(store.getState().store.card || []);
  let [settings, setSettings] = useState(false);
  let [modals, setModals] = useState(false);
  let [loading, setLoading] = useState(false);
  let [loading2, setLoading2] = useState(false);
  let [deliveryPrice, setDeliveryPrice] = useState(0);
  let [sum, setSum] = useState(0);
  let [total, setTotal] = useState(0);
  let [hoverD, setHoverD] = useState(0);
  useEffect(() => {
    getSettings();

  }, [])
  // }

  const countDelivery = (sum, renTimes, hoverD = 0) => {
    console.log('countDelivery...', sum, renTimes, hoverD);
    // console.clear();
    // let {address, hover} = state;
    // let {t} = this.props;
    return new Promise(function (resolve, reject) {
      let varprice = 0;

      let setting = renTimes[hoverD];
      console.log('countDelivery', sum);
      console.log('setting', setting);
      console.log('hoverD', hoverD);
      console.log('address', address);

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
      // if (setting && setting.theid == 'chapar') {
      //   console.log('chapar',setting.theid);
      //   if (address.City_no)
      //     getTheChaparPrice(address.City_no, sum, 1).then((res) => {
      //       if (res.result) {
      //         let tl = parseInt(res.objects.order.quote) / 10;
      //         tl = parseInt(tl);
      //         let total = parseInt(sum) + tl;
      //         resolve({deliveryPrice: tl, total: total, setting});
      //       } else {
      //         reject({});
      //       }
      //     })
      //
      // }
      // {
      let total = parseInt(sum) + parseInt(varprice);
      console.log({deliveryPrice: varprice, total: total});
      resolve({deliveryPrice: varprice, total: total});
      // }
      // this.setState({deliveryPrice: varprice, total: total});
      // return parseInt(varprice);
    });
  }

  const getSettings = () => {
    // console.clear();
    let ref = this;
    // console.log('getSettings...');

    // let {hoverD, address} = state;
    getTheSettings().then((res) => {
      console.log('after get settings...', res);
      if (!res || (res && !res.length)) {
        props.onNext();
      } else {
        setSettings(res);
        // setState({
        //   settings: res
        // });
        console.log(res, hoverD, address);
        calculateAddress(res, hoverD, address).then((obj) => {
          console.log('after calculateAddress...', obj);
          setRenTimes(obj)
          setLoading(true)
          // setState({
          //   renTimes: obj,
          //   loading: true
          // });
          // this.chooseDelivery({
          //   deliveryPrice: obj.deliveryPrice,
          //   total: obj.total,
          //   sum: obj.sum,
          //   hoverD: 0
          // }).then(res=>{
          //   this.setState({
          //     settings: res,
          //     loading: true,
          //     // deliveryPrice: obj.deliveryPrice,
          //     // total: obj.total,
          //     renTimes: obj.renTimes,
          //     // sum: sum
          //   });
          // });

          // });


          // });
        }).catch(e => console.log('e', e));
      }
    });
  }

  const countSum = (card) => {
    console.log('countSum...');
    return new Promise(function (resolve, reject) {

      let ttt = 0;
      if (card && card.length > 0)
        card.forEach((item, idx2) => {
          if (item.salePrice) {
            ttt += (item.salePrice * item.count);
          } else if (item.price && !item.salePrice) {
            ttt += (item.price * item.count);
          }
        })


      // this.calculateAddress().then((renTimes) => {
      //
      //   this.countDelivery(ttt, settings);
      // });
      resolve(ttt);

    });
  }

  const chooseDelivery = (obj) => {

    console.log('chooose delivary', obj);
    let {onChooseDelivery} = props;


    return new Promise(function (resolve, reject) {
      onChooseDelivery(obj);
      resolve(obj);
    });
  }

  const hoverThisD = (ad, renTimes) => {
    console.log('hoverThisD...', ad);
    // let {card} = state;
    console.log('renTimes', renTimes);
    countSum(card).then((sum) => {
      console.log('sum', sum);
      countDelivery(sum, renTimes, ad).then((obj) => {
        setDeliveryPrice(obj.deliveryPrice)
        setTotal(obj.total)
        setSum(sum)
        setHoverD(ad)
        setLoading2(true)
        // setState({
        //   hoverD: ad,
        //   loading2: true
        // });

        chooseDelivery({
          setting: renTimes[ad],
          deliveryPrice: obj.deliveryPrice,
          total: obj.total,
          sum: sum,
          hoverD: ad
        });

      });


    });

  }

  const calculateAddress = (settings, hoverD = hoverD, address = address) => {
    console.log('calculateAddress...', settings, hoverD, address);
    // let ref=this;
    // let {hoverD, hoverD, address} = this.state;

    let renTimes = [], ref = this;

    return new Promise(function (resolve, reject) {
      if (!address)
        return reject({});
      if (settings && settings.length > 0) {
        settings.forEach((adr, ad) => {
          if (adr.is === 'is') {

            if ((address.State == adr.city) && (supportedcity.indexOf(address.City) > -1)) {
              console.log('add...');

              renTimes.push(adr);

            }
          }
          else if (adr.is === 'isnt') {
            console.log('is not here...');

            if ((address && address.State) && (address.State != adr.city)) {
              console.log('add 0 ...');

              renTimes.push(adr);
            } else if ((address && address.State) && (address.State == adr.city) && (!(supportedcity.indexOf(address.City) > -1))) {
              console.log('add 1 ...');

              // console.log('we are here');
              renTimes.push(adr);
            }
          }
          else {
            renTimes.push(adr);

          }
        });
        console.log('renTimes...', renTimes);
        hoverThisD(0, renTimes);


        resolve(renTimes);
      }

    });
  }

  // render() {
  const {_id, onNext, onPrev} = props;
  // let sum = 0;
  // let {renTimes, loading, hoverD, loading2, deliveryPrice, total, sum} = state;
  const loader = (
    <div className="loadNotFound loader " key={23}>
      {t('loading...')}
      <LoadingComponent height={30} width={30} type="spin" color="#3d5070"/>
    </div>
  );
  const loader2 = (
    <div className="loadNotFound loader " key={23}>
      <LoadingComponent height={30} width={30} type="spin" color="#3d5070"/>
    </div>
  );
  return (
    <Card className="mb-3 pd-1">
      <CardHeader className={'pd-1'}>
        <div className="kjhghjk">
          <div
            className="d-inline-block item-icon-wrapper ytrerty"
            dangerouslySetInnerHTML={{__html: t('Delivery Schedule')}}
          />

        </div>
      </CardHeader>
      <CardBody className={'pd-1'}>
        <Col lg="12">
          {loading && <Row>
            {(renTimes && renTimes.length > 0) && renTimes.map((adr, ad) => {
              let hoverS = '';
              if (ad === hoverD) {
                hoverS = 'hover';
              }
              return (<Col className={'mb-3'} key={ad} md={12} lg={12} sm={12} onClick={() => {
                hoverThisD(ad,renTimes)
              }}>
                <div className={'radio-button ' + hoverS}></div>
                <div className={'theadds uytghui87 ' + hoverS}>
                  <div className={'ttl'}>
                    {adr.title}
                  </div>
                  <div className={'desc'}>
                    {adr.description}
                  </div>

                </div>
              </Col>)
            })}
          </Row>}
          {!loading && <Row>{loader}</Row>}
        </Col>
      </CardBody>
      <CardFooter className={'pd-1'}>
        <ButtonGroup size="sm left">
          {!loading2 && <Row>{loader2}</Row>}
          {loading2 && [<Button key={'xo0'} className={'back-to-checkout-part-address'} left={"true"} onClick={onPrev}><i
            className="material-icons">{'chevron_right'}</i>{t('prev')}
          </Button>,
            <Button key={'xo1'} className={'go-to-checkout-part-last'} left={"true"} onClick={onNext}>{t('next')}<i
              className="material-icons">{'chevron_left'}</i></Button>
          ]}

        </ButtonGroup>
      </CardFooter>
    </Card>
  );
  // }
}

export default withTranslation()(GetDelivery);
