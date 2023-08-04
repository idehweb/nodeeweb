import React, {useEffect, useState} from "react";
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
  SaveData,
  setCountry
} from "#c/functions/index";

import {ProductsSliderServer} from "#c/components/components-overview/ProductsSlider";
import {PostSliderServer} from "#c/components/components-overview/PostSlider";
import {withTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";

const getURIParts = (url) => {
  var loc = new URL(url)
  return loc
}
const Description = (props) => {
  console.log('Description...', props)
  let navigate = useNavigate();

  const [tracks, settracks] = useState("");
  const [theload, settheload] = useState(true);
  let {match, location, history, t, url} = props;
  let {element = {}} = props;
  let {data = {}, settings = {}} = element;
  let {general = {}} = settings;
  let {fields = {}} = general;
  let {entity = 'productCategory', _id = ''} = fields;
  let mainParams = useParams();
  let params = data;
  console.log('mainParams', mainParams)
  const loadDes = async () => {
    if (mainParams._id)
      getEntity(entity, mainParams._id).then((resp) => {
        console.log('resp', resp)
        // setLoadingMoreItems(false);
        afterGetData(resp);
      });
  };

  //
  // useEffect(() => {
  //   console.log("params.offset");
  //   loadProductItems(0);
  // }, [params.offset]);

  useEffect(() => {
    // console.log("params._id");
    loadDes();
  }, []);
  //

  const afterGetData = (resp, tracks = []) => {
    console.log('afterGetData', resp, tracks)
    if (resp) {

      if (resp.description && resp.description['fa']) {
        console.log("resp.description['fa']",resp.description['fa'])
        settracks(resp.description['fa']);
        settheload(false)

      }

      // if (resp && resp.length < 1) sethasMoreItems(false);
    } else {
      // sethasMoreItems(false);
      // setLoad(false);
      settheload(false)

    }
  };
  const loader = (
    <div className="loadNotFound loader " key={23}>
      {t("loading...")}
      <LoadingComponent height={30} width={30} type="spin" color="#3d5070"/>
    </div>
  );
  return (<div className="main-content-container fghjkjhgf ">
      {theload && loader}
      {(!theload && tracks) && <div
        className="d-inline-block item-icon-wrapper mt-3 ki765rfg hgfd"
        dangerouslySetInnerHTML={{__html: tracks}}
      />}
    </div>
  );
};
export const HomeServer = [

  {
    func: loadPosts,
    params: null
  },
  {
    func: fetchCats,
    params: null
  }];
export default withTranslation()(Description);
