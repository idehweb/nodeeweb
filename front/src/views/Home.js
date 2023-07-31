import React, {useEffect} from "react";
import {Col, Row} from 'shards-react';

import MainContent from '#c/components/MainContent';
import PageBuilder from "#c/components/page-builder/PageBuilder";
import CardSidebar from '#c/components/layout/MainSidebar/CardSidebar';

import {
  enableAdmin,
  enableAgent,
  enableSell,
  fetchCats,
  getPosts,
  getPostsByCat,
  getThemeData,
  isClient,
  loadPosts,
  loadProducts,
  SaveData,
  setCountry
} from "#c/functions/index";
import PostSlider from "#c/components/components-overview/PostSlider";
import {store} from '#c/functions/store';

import {withTranslation} from "react-i18next";
import {useSelector} from "react-redux";

// store.dispatch(fetchHome());

const Home = (props) => {

  const themeData = useSelector((st) => st.store.themeData);
  const homeData = useSelector((st) => st.store.homeData);

  useEffect(() => {
  }, []);
  if (themeData) {

    return <>


      {themeData.body && themeData.body.map((body, h) => {

        if (body.name === 'MainContent') {
          return <MainContent {...props}/>

        }


      })}

    </>
  } else
    return <></>
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

export default withTranslation()(Home);
