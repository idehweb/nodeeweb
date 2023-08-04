import React, { useEffect, useState } from "react";
import { getBookmarks, MainUrl } from "#c/functions/index";
import PostCard from "#c/components/Home/PostCard";
import { withTranslation } from "react-i18next";
import { blueImg, topsaleImg } from "#c/assets/index";
import { Col, Row } from "shards-react";
import BookmarksIcon from '@mui/icons-material/Bookmarks';

const WishList = ({ t }) => {
  const [tracks, settracks] = useState([]);


  const loadProductItems = async () => {
    // if (cat_id)
    getBookmarks().then((resp) => {
      settracks(resp);
    });
    // else
    //   getPosts(0, 20, '').then((resp) => {
    //     // setLoadingMoreItems(false);
    //     // afterGetData(resp);
    //     settracks(resp);
    //
    //   });

    // }
  };
  useEffect(() => {
    loadProductItems();
  }, []);

  // console.clear();

  return (
    [<Row className={"limited mt-5"}>
      <div className={"title mb-3 p-2"}>
        <BookmarksIcon className={'mr-2'}/> {t("Your wishlist")}
      </div>
    </Row>,
    <Row className={"limited mt-2"}>

      {(tracks && tracks.length > 0) && tracks.map((i, idx) => {

          return (
            <Col key={idx} lg="3"
                 md="4"
                 sm="4"
                 xs="6" className={"nbghjk post-style-grid"}>

              <PostCard item={i}/>
            </Col>
          );
        }
      )}


    </Row>]
  );
};

export default withTranslation()(WishList);
