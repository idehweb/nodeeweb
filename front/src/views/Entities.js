import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import _ from 'underscore';

import {Col, Row} from "shards-react";
import InfiniteScroll from "react-infinite-scroller";
import LoadingComponent from "#c/components/components-overview/LoadingComponent";
import Product from "#c/views/Product";
import Sort from "#c/components/archive/Sort";
import {
  enableAdmin,
  enableAgent,
  enableSell,
  fetchCats,
  getEntities,
  getPosts,
  getPostsByCat,
  isClient,
  loadPosts,
  loadProducts,
  SaveData,
  setCountry
} from "#c/functions/index";
import store from "#c/functions/store";
import {ProductsSliderServer} from "#c/components/components-overview/ProductsSlider";
import {PostSliderServer} from "#c/components/components-overview/PostSlider";
let theFilter=false;
import {withTranslation} from "react-i18next";
import PostCard from "#c/components/Home/PostCard";
import {useSelector} from "react-redux";
const Entities = (props) => {
  let {match, location, history, t, url} = props;
  let params = useParams();
  history = useNavigate();
  url = isClient ? new URL(window.location.href) : "";
  let filter = isClient ? (url.searchParams.get("filter") || {}) : {};
  let search = isClient ? (url.searchParams.get("search") || "") : "";
  const [tracks, settracks] = useState([]);
  let [showSlide, setShowSlide] = useState(true);

  const [hasMoreItems, sethasMoreItems] = useState(true);
  const [single, set_single] = useState(false);
  const [single_id, set_single_id] = useState("");
  const [attrP, setAttr] = useState("");
  const [valueP, setValue] = useState("");
  let [offset, setoffset] = useState(-24);
  const [loadingMoreItems, setLoadingMoreItems] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [catid, setcatid] = useState(params._id);
  const [load, setLoad] = useState(null);
  const postCardMode = useSelector((st) => st.store.postCardMode, _.isEqual);
  const sortBy = useSelector((st) => st.store.sortBy, _.isEqual);
  const defaultSort = useSelector((st) => st.store.defaultSort, _.isEqual);

  useEffect(() => {
    if(theFilter!=filter) {
      setoffset(-24);
      offset = -24;
      sethasMoreItems(true);
      settracks([]);
      theFilter=filter;
      loadProductItems(0, filter);
    }
  }, [filter]);
  const loadProductItems = async (page, filter = {}) => {
    let newOffset = (await offset) + 24;
      await setoffset(newOffset);
      await setInitialLoad(false);
      await setLoadingMoreItems(true);
      getEntities(params._entity, newOffset, 24, search || "", filter).then((resp) => {
        setLoadingMoreItems(false);
        afterGetData(resp);
      });
  };
  if (isClient) {

    let attr = url.searchParams.get("attr") || "";
    let value = url.searchParams.get("value") || "";
    if (attr !== attrP)
      setAttr(attr);
    if (value !== valueP)
      setValue(value);

  }
  useEffect(() => {
    filter = isClient ? (url.searchParams.get("filter") || false) : false;
    setoffset(-24);
    sethasMoreItems(true);
    settracks([]);
    loadProductItems(0,filter);
  }, []);

  const afterGetData = (resp) => {
    let trackss = [...tracks];
    if (resp.length < 24) sethasMoreItems(false);
    if (resp && resp.length) {
      resp.forEach((item) => {
        trackss.push(item);
      });
      settracks(trackss);
      if (resp && resp.length < 1) sethasMoreItems(false);
    } else {
      sethasMoreItems(false);
      setLoad(false);
    }
  };

  const loader = (
    <div className="loadNotFound loader " key={23}>
      {t("loading...")}
      <LoadingComponent height={30} width={30} type="spin" color="#3d5070"/>
    </div>
  );
  if (catid || search)
    showSlide = false;


  return (<div className="main-content-container fghjkjhgf ">

      <Row className={"m-0"}>
        {(!showSlide) && <Col
          className="main-content iuytfghj pb-5 "
          lg={{size: 12}}
          md={{size: 12}}
          sm="12"
          tag="main">
          <Sort/>
          <InfiniteScroll
            pageStart={0}
            initialLoad={initialLoad}
            loadMore={() =>
              !initialLoad && !loadingMoreItems ? loadProductItems() : null
            }
            hasMore={hasMoreItems}
            catid={catid}
            loader={loader}
            offset={offset}
            className={"row p-3 productsmobile "}
            element="div">
            {tracks && tracks.map((i, idxx) => (
              <Col key={idxx} lg="2"
                   md="3"
                   sm="4"
                   xs="6" className={"nbghjk post-style-" + postCardMode}>

                <PostCard item={i} method={postCardMode}/>

              </Col>
            ))}
          </InfiniteScroll>

          {single && (
            <div className={"kjuyhgfdfgh modallllll " + single}>
              <div className="col-sm-12 col-md-9 offset-md-3 col-lg-10 offset-lg-2">
                <Product match={{params: {_id: single_id}}}></Product>
              </div>
            </div>
          )}
        </Col>}
      </Row>
    </div>
  );
};
export const HomeServer = [
  {
    func: loadProducts,
    params: "61d58e38d931414fd78c7fca"
  },
  {
    func: loadProducts,
    params: "61d58e37d931414fd78c7fbd"
  },
  {
    func: loadProducts,
    params: "61d58e37d931414fd78c7fb7"
  },
  {
    func: loadProducts,
    params: "61d58e37d931414fd78c7fb9"
  },
  {
    func: loadProducts,
    params: "61d58e37d931414fd78c7fbc"
  },
  {
    func: loadProducts,
    params: "61d58e37d931414fd78c7fba"
  },
  {
    func: loadPosts,
    params: null
  },
  {
    func: fetchCats,
    params: null
  }];
// export const HomeServer = loadProducts;
// export const HomeServerArgument = "61d58e37d931414fd78c7fba";
// export const HomeServer = fetchData("61d58e37d931414fd78c7fba");
export default withTranslation()(Entities);
