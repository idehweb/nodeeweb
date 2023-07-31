import React, {Suspense, useEffect, useState} from "react";
import Swiper from "#c/components/swiper";
import {isClient, loadProductItems, MainUrl,isStringified} from "#c/functions/index";
import PostCard from "#c/components/Home/PostCard";
import {withTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";

const ProductsSlider = ({cat_id = null, customQuery, delay = 2500,perPage,autoplay,pagination,breakpoints, t}) => {
  // console.log("\nProductsSlider==================>");
  let productSliderData = useSelector((st) => {
    return st.store.productSliderData;
  });

  const [tracks, settracks] = useState(isClient ? [] : (productSliderData[cat_id]));
  let params = useParams();

  // const [tracks, settracks] = useState([]);
  // console.log("cat_id:", cat_id);
  // console.log("ProductsSlider:", productSliderData[cat_id]);
  if (isClient)
    useEffect(() => {
      console.log("\nuseEffect ProductsSlider==================>");

      let query = {}, filter = {};
      if (customQuery) {
        console.log('customQuery main', customQuery)

        if (typeof customQuery == 'string') {
          customQuery = JSON.parse(customQuery)
        }

        Object.keys(customQuery).forEach((item) => {
          let main = customQuery[item];
          if (params && params._id) {
            console.log('main:',main)
            main = main.replace('params._id', JSON.stringify(params._id))
          }
          console.log('customQuery[item]', item, customQuery, customQuery[item])
          console.log('main', main)
          const json = isStringified(main);

          if (typeof json == 'object')
            query[item] = json
          else
            query[item] = main

        })
      }
      // console.log("==> loadProductItems() offset:", offset, "filter:", filter, "query:", query);
      if (query) {
        filter = JSON.stringify(query)
      }
      loadProductItems(cat_id, filter).then(res => settracks(res));


    }, []);
  // if (tracks)
  //   console.log("product tracks", tracks.length);
  // if ((tracks && tracks.length > 0))
  return (
    <Suspense fallback={<div> loading... </div>}>
      <div className={"rtl "}>
        {(tracks && tracks.length > 0) && <Swiper breakpoints={breakpoints || {
          1024: {
            perPage: 4
          },
          768: {

            perPage: 3
          },
          640: {

            perPage: 2
          },
          320: {

            perPage: 1
          }
        }} perPage={perPage} autoplay={autoplay} pagination={pagination}>

          {tracks.map((i, idx) => {
            if (!i.slug) {
              i.slug = 'kjhjk'
            }
            return (
              <div className={"swiper-slide"} key={idx}><PostCard item={i}/></div>
            )
          })}
        </Swiper>}

      </div>
    </Suspense>
  );
  // else {
  //   return <div>hjkjhghjklkjhj</div>;
  // }
};
export const ProductsSliderServer = loadProductItems;

export default withTranslation()(ProductsSlider);
// export default {
//   component: Content,
//   loadData: dispatch => (
//     fetchRequestQuery(dispatch)
//   ),
// };
