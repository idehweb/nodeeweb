import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {Col, Row} from "shards-react";
import LoadingComponent from "#c/components/components-overview/LoadingComponent";

import {
  enableAdmin,
  enableAgent,
  enableSell,
  fetchCats,
  getEntitiesWithCount,
  getEntity,
  getPath,
  getPosts,
  getPostsByCat,
  isClient,
  loadPosts,
  loadProducts,
  SaveData,
  getEntities,
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

const Currency = (props) => {
  console.log('Pagination...', props)
  let navigate = useNavigate();

  const [tracks, settracks] = useState([]);
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
    settracks([])
    settheload(true)
    let query = {};

    // let newOffset = (await offset) + 24;
    getEntity('settings','get-exchange-rate').then((resp) => {
      // setLoadingMoreItems(false);
      afterGetData(resp);
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
    console.log('set data:', resp)
    settracks(resp);
    // setcount(count);
    settheload(false)

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
          <table className={'currency'}>
            <tbody>

            {tracks && tracks.map((i, idxx) => (<tr>
              <td>{i.currency}</td>
              <td> {i.price}</td>
            </tr>))}
            </tbody>
          </table>


        </Col>}
      </Row>
      {/*{cats && JSON.stringify(cats)}*/}
    </div>
  );
};
export const HomeServer = [];
export default withTranslation()(Currency);
