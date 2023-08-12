import React, {useEffect, useState} from "react";
import {useNavigate,useParams} from "react-router-dom";
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
import {ProductsSliderServer} from "#c/components/components-overview/ProductsSlider";
import {PostSliderServer} from "#c/components/components-overview/PostSlider";
import {withTranslation} from "react-i18next";
import PostCard from "#c/components/Home/PostCard";
import {useSelector} from "react-redux";

let theFilter = false;
//
const LoadMore2 = (props) => {
  console.log('LoadMore...', props);
  let {element = {}} = props;
  let {data = {}} = element;
  return <>{JSON.stringify(data)}</>;
}
const LoadMore = (props) => {
  console.log('LoadMore...', props);

  let {match, location, history, t, url} = props;
  let {element = {}} = props;
  let {data = {}, settings = {}} = element;
  let {general = {}} = settings;
  let {fields = {}} = general;
  let {entity = '', customQuery,populateQuery} = fields;
  // let params = useParams();
  let params = data;
  history = useNavigate();
  url = isClient ? new URL(window.location.href) : "";
  let filter = isClient ? (url.searchParams.get("filter") || {}) : {};
  let search = isClient ? (url.searchParams.get("search") || "") : "";
  const [tracks, settracks] = useState([]);
  // let showSlide = true;

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
  //
  // const postCardMode = store.getState().store.postCardMode;
  const postCardMode = useSelector((st) => st.store.postCardMode, _.isEqual);
  const sortBy = useSelector((st) => st.store.sortBy, _.isEqual);
  const defaultSort = useSelector((st) => st.store.defaultSort, _.isEqual);


  // console.log('sortBy', sortBy);
  // const theAttr = useSelector((st) => st.store.attr);
  // const theValue = useSelector((st) => st.store.value);
  // console.log("theAttr", theAttr, "theValue", theValue);
  // if (isClient) {
  useEffect(() => {
    console.log('data changed',data)
    // settracks([])
    params = data;
    setoffset(-24)
    offset=-24
    settracks([])
     setInitialLoad(true);
     setLoadingMoreItems(false);
     // setLoadingMoreItems(false);
    loadProductItems(0)
  }, [data]);
  //   useEffect(() => {
  //
  //     let url = new URL(window.location.href);
  //     let eAd = url.searchParams.get("enableAdmin") || "";
  //     if (eAd) {
  //       console.log('enableAdmin');
  //       enableAdmin(true);
  //     }
  //
  //
  //   }, []);
  //
  // }
  // useEffect(() => {
  //   console.log('defaultSort changed to: ', defaultSort);
  //   SaveData({
  //     defaultSort: defaultSort
  //   });
  //   setoffset(-24);
  //   offset = -24;
  //   sethasMoreItems(true);
  //   settracks([]);
  //   loadProductItems(0);
  //
  // }, [defaultSort]);
  // useEffect(() => {
  //
  //   console.log('sortBy', sortBy);
  //
  // }, [sortBy]);
  useEffect(() => {
    // if(theFilter!=filter) {
    //   console.log('filter', filter);
    //   setoffset(-24);
    //   offset = -24;
    //   sethasMoreItems(true);
    //   settracks([]);
    //   theFilter=filter;
    //   loadProductItems(0, filter);
    // }
  }, [filter]);
  const loadProductItems = async (page, filter = {}) => {
    console.log('loadProductItems',params)
    // setLoadingMoreItems(true);

    // settracks([...[]]);

    let query = {};
    // params = useParams();
    if (customQuery)
      Object.keys(customQuery).forEach((item) => {
        let main=customQuery[item];
        main = main.replace('params._id', JSON.stringify(params._id))
        console.log('customQuery[item]', item, customQuery, customQuery[item])
        query[item] = JSON.parse(main)
      })

    console.log("==> loadProductItems() offset:", offset, "filter:", filter, "query:", query);
    if (query) {
      filter = JSON.stringify(query)
    }
    // if(!loadingMoreItems){
    let newOffset = (await offset) + 24;
    // if (!catId && !showSlide) {
    //   let trackss = [...tracks];
    //
    //   await setoffset(newOffset);
    //   await setInitialLoad(false);
    //   await setLoadingMoreItems(true);
    //   getPosts(newOffset, 48, search || "", filter).then((resp) => {
    //     setLoadingMoreItems(false);
    //     afterGetData(resp);
    //   });
    //   return;
    // } else {
    // console.clear();
    // console.log('v',params._entity)
    await setoffset(newOffset);
    await setInitialLoad(false);
    await setLoadingMoreItems(true);
    getEntities(params._entity || entity, newOffset, 24, search || "", filter,JSON.stringify(populateQuery)).then((resp) => {
      setLoadingMoreItems(false);
      afterGetData(resp);
    });


    // }
    // }
  };
  if (isClient) {

    let attr = url.searchParams.get("attr") || "";
    let value = url.searchParams.get("value") || "";
    // if (attr !== attrP)
    //   setAttr(attr);
    // if (value !== valueP)
    //   setValue(value);

  }
  // useEffect(() => {
  //   loadProductItems(0, catid);
  // }, [catid]);


  // useEffect(() => {
  //   console.log("match.params._id", match, "and:", catid);
  //   if (params._id !== catid) {
  //     setcatid(params._id);
  //     sethasMoreItems(true);
  //     settracks([]);
  //     setoffset(-24);
  //   }
  // }, [params._id, catid]);
  useEffect(() => {
    //   console.log("we changed value...");
    //   filter = isClient ? (url.searchParams.get("filter") || false) : false;
    //
    //   setoffset(-24);
    //
    //   // settracks([]);
    //   sethasMoreItems(true);
    //   settracks([]);
    //   //
    loadProductItems(0);
  }, []);

  const afterGetData = (resp,tracks=[]) => {
    console.log('afterGetData',resp,tracks)
    let trackss = [...tracks];
    if (resp.length < 24) sethasMoreItems(false);
    // console.log("resp", resp);
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
// return JSON.stringify(params)
  const loader = (
    <div className="loadNotFound loader " key={23}>
      {t("loading...")}
      <LoadingComponent height={30} width={30} type="spin" color="#3d5070"/>
    </div>
  );
  // console.log("Home", catid, search);
  if (catid || search)
    showSlide = false;

  // return JSON.stringify(customQuery) + ' ' + JSON.stringify(params)
  return (<div className="main-content-container fghjkjhgf ">

      <Row className={"m-0"}>
        {/*{(!showSlide) && <Col tag="aside" lg={{size: 3}} md={{size: 4}} className={"sidebar white mobilenone"}>*/}
        {/*<Row className={""}>*/}
        {/*<Col lg={{size: 12}} md={{size: 12}}>*/}
        {/*<SidebarNavItems/>*/}
        {/*</Col>*/}
        {/*</Row>*/}
        {/*</Col>}*/}


        {(!showSlide) && <Col
          className="main-content iuytfghj pb-5 "
          lg={{size: 12}}
          md={{size: 12}}
          sm="12"
          tag="main">
          <Sort/>
          <InfiniteScroll
            pageStart={0}
            // initialLoad={initialLoad}
            loadMore={loadProductItems}
            // loadMore={() =>
            // {
            //   console.log('loadMore')
            //   return !initialLoad && !loadingMoreItems ? loadProductItems() : null
            // }}
            hasMore={hasMoreItems}
            // catid={catid}
            loader={loader}
            // offset={offset}
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
export default withTranslation()(LoadMore);
