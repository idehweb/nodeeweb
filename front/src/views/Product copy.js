import React, {useEffect, useState} from "react";
import {Badge, Button, ButtonGroup, Col, Container, Nav, NavItem, NavLink, Row} from "shards-react";
import {Link, useParams} from "react-router-dom";
import Gallery from "#c/components/single-post/Gallery";
import Theprice from "#c/components/single-post/Theprice";
import SidebarActions from "#c/components/single-post/SidebarActions";
import RelatedProducts from "#c/components/single-post/RelatedProducts";
import Comments from "#c/components/single-post/Comments";
import {withTranslation} from "react-i18next";
import {dFormat, PriceFormat} from "#c/functions/utils";

import {addBookmark, clearPost, getPost, isClient, loadProduct, loveIt, MainUrl, savePost} from "#c/functions/index";
import {SnapChatIcon} from "#c/assets/index";
import Loading from "#c/components/Loading";
import store from "../functions/store";
import {useSelector} from "react-redux";
import CONFIG from "#c/config";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import EditIcon from "@mui/icons-material/Edit";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
// import { Link, useNavigate, useParams } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PaymentsIcon from '@mui/icons-material/Payments';
import VerifiedIcon from '@mui/icons-material/Verified';
// let obj = ;
import {toast} from "react-toastify";
// let the_id='';
import {RWebShare} from "react-web-share";

import DescriptionIcon from "@mui/icons-material/Description";
import EditAttributesIcon from "@mui/icons-material/EditAttributes";
import ReviewsIcon from "@mui/icons-material/Reviews";

const Product = (props) => {

  let {match, location, history, t, url} = props;

  let product = useSelector((st) => {
    // console.log("st.store", st.store.productSliderData);
    return st.store.product || [];
  });
  // window.scrollTo(0, 0);
  let params = useParams();
  // console.log("params", params);
  // return;
  let the_id = params._id || params._product_slug;
  // let search = false;
  // let history = useNavigate();

  let st = store.getState().store;
  let fp=localStorage.getItem('username');
  // return JSON.stringify(fp)
  let admin_token = null;
  if (fp) {
    admin_token = fp;
  }
  const [mainId, setMainId] = useState(the_id);
  const [tab, setTab] = useState("attributes");
  const [state, setState] = useState(isClient ? [] : (product || []));
  const [lan, setLan] = useState(store.getState().store.lan || "fa");
  // const [enableAdmin] = useState(store.getState().store.enableAdmin || false);


  const getThePost = (_id) => {
    return new Promise(function (resolve, reject) {

      getPost(_id).then((d = {}) => {
        console.log("set _id to show:", d);
        // savePost({
        //   mainList: d.mainList,
        //   catChoosed: d.catChoosed,
        //   countryChoosed: d.countryChoosed,
        //   categories: d.categories,
        //   mainCategory: d.mainCategory
        // });
        resolve({
          load: true,
          title: d.title,
          description: d.description,
          lyrics: d.lyrics,
          files: d.files,
          photos: d.photos,
          _id: d._id,
          extra_button: d.extra_button,
          customer: d.customer,
          catChoosed: d.catChoosed,
          countryChoosed: d.countryChoosed,
          updatedAt: d.updatedAt,
          nextPost: d.nextPost,
          type: d.type,
          price: d.price,
          salePrice: d.salePrice,
          allPostData: d.data,
          questions: d.questions,
          firstCategory: d.firstCategory,
          secondCategory: d.secondCategory,
          thirdCategory: d.thirdCategory,
          sections: d.sections,
          options: d.options,
          in_stock: d.in_stock,
          quantity: d.quantity,
          thumbnail: d.thumbnail,
          labels: d.labels,
          excerpt: d.excerpt,
          categories: d.categories,
          extra_attr: d.extra_attr,
          data: d.data,
          views: d.views,
          like: d.like,
          combinations: d.combinations
        });
      });
    });
  };
  if (isClient)
    useEffect(() => {
      // let mounted = true;
      let {_id, title} = params;

      console.log("useEffect", _id, the_id, mainId);

      getThePost(the_id)
        .then(items => {
          // console.log('items',items,the_id);
          // if (mounted) {
          setState(items);
          if (isClient)
            window.scrollTo(0, 0);
          // }
        });
      // return () => mounted = false;
    }, [the_id]);

  // useEffect(() => {
  //   let { _id, title } = params;
  //   console.log("useEffect", _id, the_id, mainId);
  //   // if (mainId != _id) {
  //   getThePost(_id).then(res=>setState(state => ({ ...state, ...res })));
  //   window.scrollTo(0, 0);
  //   // }
  //
  // }, [the_id]);


  let {
    labels,
    load,
    title,
    description,
    photos,
    redirect,
    price,
    salePrice,
    _id,
    customer,
    type,
    updatedAt,
    countryChoosed,
    firstCategory,
    secondCategory,
    thirdCategory,
    sections,
    categories,
    combinations,
    options,
    quantity,
    thumbnail,
    extra_button,
    in_stock,
    extra_attr,
    sku,
    excerpt,
    like,
    data,
    views = null
  } = state;
  if (redirect && isClient) return <Navigate to={redirect}/>;
  if (!load && isClient) return <Loading/>;
  // console.log("product", title, lan, encodeURIComponent(title[lan]));

  return (

    [<Container className="main-content-container p-0 pb-4 kiuytyuioiu bg-white" key={0}>
      <Row className={"limited posrel"}>
        <Col lg="6" md="12">
          <h1 className="kjhghjk hgfd ">
            {title && title[lan]}
          </h1>
        </Col>
        <Col lg="6" md="12">
          <div className={'sdfrew'}>ردیف تعرفه:{sku}</div>

          <div className={'d-flex justuhghjk'}>
            <span>سود بازرگانی:{data.commercialbenefit}</span>
            <span>حقوق گمرکی:{data.customduty}</span>
            <span>حقوق ورودی:{data.importduty}</span>
          </div>

        </Col>

      </Row>


    </Container>,
      <Container className="main-content-container pb-4 kiuytyuioiu bg-white" key={1}>
        <Row>

          <Col lg={12} md={12} sm={12} xs={12} className={"hgfrdsxcvghytf"}>
            {firstCategory && <RelatedProducts cat_id={firstCategory._id}/>}
          </Col>
        </Row>

      </Container>]
  );
};
export const ProductServer = [
  {
    func: loadProduct,
    params: ""
  }
];
export default withTranslation()(Product);
