import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Col, FormInput, Row,} from 'shards-react';
import LoadingComponent from "#c/components/components-overview/LoadingComponent";

import {
  enableAdmin,
  enableAgent,
  enableSell,
  fetchCats,
  getEntitiesWithCount,
  getEntity,
  getPosts,
  getPostsByCat,
  isClient,
  loadPosts,
  loadProducts,
  postPath,
  SaveData,
  setCountry
} from "#c/functions/index";
import {ProductsSliderServer} from "#c/components/components-overview/ProductsSlider";
import {PostSliderServer} from "#c/components/components-overview/PostSlider";
import {withTranslation} from "react-i18next";
import _ from "underscore";
import {useSelector} from "react-redux";

const getURIParts = (url) => {
  var loc = new URL(url)
  return loc
}

const Tsc = (props) => {
  console.log('TSC...', props)
  let navigate = useNavigate();
  let [dis, setDis] = useState('');
  let [cap, setCaptch] = useState('');

  const [tracks, settracks] = useState("");
  const [cats, setcats] = useState([]);
  const [counts, setcount] = useState(0);
  const [theload, settheload] = useState(false);
  const [theload2, settheload2] = useState(false);
  let {match, location, history, t, url} = props;
  let {element = {}, params = {}} = props;
  let {data = {}, settings = {}} = element;
  let {general = {}} = settings;
  let {fields = {}} = general;
  let {entity = '', customQuery, populateQuery} = fields;
  let mainParams = useParams();
  // let params = data;
  if (!params.offset) {
    params.offset = 0
  }
  if (!params.limit) {
    params.limit = 24
  }
  url = isClient ? new URL(window.location.href) : "";
  let theurl = getURIParts(url);
  // theurl=theurl.split('/');
  // console.log('mainParams',theurl[1])

  const postCardMode = useSelector((st) => st.store.postCardMode, _.isEqual);

  // console.log('general', general)
  // console.log('params', params)
  // const params = useParams();
  const loadProductItems = async (page, filter = {}) => {
    settracks("")
    settheload(true)
    let query = {};

    // let newOffset = (await offset) + 24;
    postPath('settings/get-tsc-form').then((html) => {
      // setLoadingMoreItems(false);
      console.log(html);
      afterGetData(html);
    });
  };


  // useEffect(() => {
  //   console.log("params.offset");
  //   loadProductItems(0);
  // }, [params.offset]);

  useEffect(() => {
    console.log("params._id");
    loadProductItems(0);
  }, []);
  //

  const afterGetData = (resp, tracks = []) => {
    console.log('afterGetData', resp, tracks)
    // let trackss = [...tracks],
    //   {items, count} = resp;
    // if (resp.length < 24) sethasMoreItems(false);
    // console.log("resp", resp);
    // if (items && items.length) {
    //   items.forEach((item) => {
    //     trackss.push(item);
    //   });
    // console.log('set data:', trackss)
    settheload(false)

    settracks(resp);
    // setcount(count);

    // if (resp && resp.length < 1) sethasMoreItems(false);
    // } else {
    //   // sethasMoreItems(false);
    //   // setLoad(false);
    //   settheload(false)
    //
    // }
  };
  const loader = (
    <div className="loadNotFound loader " key={23}>
      {t("loading...")}
      <LoadingComponent height={30} width={30} type="spin" color="#3d5070"/>
    </div>
  );

  return (<div className="main-content-container fghjkjhgf ">

      <Row className={"m-0"}>
        {theload && loader}

        {!theload && <Col
          className="main-content iuytfghj pb-5 "
          lg={{size: 12}}
          md={{size: 12}}
          sm="12"
          tag="main">
          {/*{JSON.stringify(tracks)}*/}
          <div className={'maininputpart'}>

          <label>{t('tsc id search') + ':'}</label>

          <FormInput
            size={'lg'}
            id="tscid"
            value={dis}
            onChange={(event) => {
              setDis(event.target.value)
            }}
          />
          </div>
          <div className={'captchapart'}>
            <div>
              <img
                className="thisiscaptcha d-inline-block item-icon-wrapper ki765rfg  hgfd mb-5"
                src={tracks}
              />
            </div>
            <label>{t('enter captcha') + ':'}</label>
            <FormInput
              size={'lg'}

              value={cap}
              onChange={(event) => {
                setCaptch(event.target.value)
              }}
            />
          </div>
          <div className={'text-align-center'}>
          <Button size="lg" className={' '} onClick={(e) => {

          }}>{t('tsc search')}</Button>
          </div>
        </Col>}
      </Row>
      {/*{cats && JSON.stringify(cats)}*/}
    </div>
  );
};
export const HomeServer = [];
export default withTranslation()(Tsc);
