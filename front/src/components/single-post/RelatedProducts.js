import React, { useEffect, useState } from "react";
import Swiper from "#c/components/swiper";
import { getPosts, getPostsByCat, MainUrl } from "#c/functions/index";
import PostCard from "#c/components/Home/PostCard";
import { withTranslation } from "react-i18next";
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
const RelatedProducts = ({ cat_id, t }) => {
  const [tracks, settracks] = useState([]);

  const goToPage = (post) => {

  };

  const loadProductItems = async () => {

    // getPosts(0, 12,'').then((resp) => {
    //   // setLoadingMoreItems(false);
    //   // afterGetData(resp);
    //   settracks(resp);
    //
    // });
    getPostsByCat(0, 12, cat_id, "").then((resp) => {
      settracks(resp);

    });

    // }
  };
  useEffect(() => {
    loadProductItems();
  }, []);

  // console.clear();

  return (
    <div className={"ltr mt-5"}>
      <div className={"title mb-3 p-2"}>
        <ShoppingBasketIcon className={'mr-2'}/> {t("Related Products")}
      </div>
      <Swiper perPage={8} gap={"2px"} breakpoints={{
        1300: {
          perPage: 6,
        },
        1024: {
          perPage: 4,
        },
        768: {
          perPage: 3,
        },
        640: {
          perPage: 2,
        },
        320: {
          perPage: 2,
        }
      }}>

        {tracks && tracks.map((i, idx) => (
          <div className={"swiper-slide"} key={idx}><PostCard item={i}/></div>
        ))}
      </Swiper>

    </div>
  );
};

export default withTranslation()(RelatedProducts);
