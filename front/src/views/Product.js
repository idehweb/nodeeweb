import React, {useEffect, useState} from "react";
// import warrantyIcon from window.location.origin + '/assets/warranty.png'

import {Badge, Button, ButtonGroup, Col, Container, Nav, NavItem, NavLink, Row} from "shards-react";
import {Link, useParams} from "react-router-dom";
import Gallery from "#c/components/single-post/Gallery";
import {WarrantyIcon,SecurityIcon,PersonInIcon,ImideatlyIcon} from "#c/components/single-post/base";
import Theprice from "#c/components/single-post/Theprice";
import SidebarActions from "#c/components/single-post/SidebarActions";
import RelatedProducts from "#c/components/single-post/RelatedProducts";
import Comments from "#c/components/single-post/Comments";
import {withTranslation} from "react-i18next";
import {dFormat, PriceFormat} from "#c/functions/utils";

import {addBookmark, clearPost, getPost, isClient, loadProduct, loveIt, MainUrl, savePost,getThemeData} from "#c/functions/index";
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

    return st.store.product || [];
  });

  // window.scrollTo(0, 0);
  let params = useParams();
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
  const [requiredWarranty, setRequiredWarranty] = useState(true);
  // const [enableAdmin] = useState(store.getState().store.enableAdmin || false);


  const getThePost = (_id) => {
    return new Promise(function (resolve, reject) {

      getPost(_id).then((d = {}) => {
        // savePost({
        //   mainList: d.mainList,
        //   catChoosed: d.catChoosed,
        //   countryChoosed: d.countryChoosed,
        //   categories: d.categories,
        //   mainCategory: d.mainCategory
        // });


        // **********WarrantyRequired*********************

        if(d.requireWarranty){
          setRequiredWarranty(d.requireWarranty)
        }else{
          setRequiredWarranty(false)
        }

        // **************WarrantyRequired*****************


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
      getThePost(the_id)
        .then(items => {
          setState(items);
          if (isClient)
            window.scrollTo(0, 0);
          // }
        });
      // return () => mounted = false;
    }, [the_id]);

  // useEffect(() => {
  //   let { _id, title } = params;
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
    excerpt,
    like,
    views = null
  } = state;
  if (redirect && isClient) return <Navigate to={redirect}/>;
  if (!load && isClient) return <Loading/>;

  return (

    [<Container className="main-content-container p-0 pb-4 kiuytyuioiu bg-white" key={0}>

      <Row className={"limited posrel justify-end"}>
        <div className={"floating-tools"}>
          <ButtonGroup vertical>
            <Button className={"love-it "}

                    onClick={() => {
                      loveIt(_id).then(res => {
                        if (res.like) {
                          like = res.like;
                          setState({...state, like: like});
                        }
                        toast(t(res.message), {
                          type: "success"
                        });
                      }).catch(err => {
                        toast(t(err.message), {
                          type: "warning"
                        });
                      });
                    }}>
              <FavoriteBorderIcon className={"beforehov"}/>
              <FavoriteIcon className={"hov"}/>
              <Badge
              theme="info">{like}</Badge></Button>

            {Boolean(isClient && title) && <RWebShare
              data={{
                text: excerpt,
                url: CONFIG.SHOP_URL + "p/" + _id + "/" + encodeURIComponent(title[lan]),
                title: title[lan]
              }}
              sites={["whatsapp", "telegram", "linkedin", "copy"]}
              closeText={t("close")}
              onClick={() => console.log("shared successfully!")}
            >
              <Button>
                <ShareIcon/>
              </Button>
            </RWebShare>}
            {views && <Button><RemoveRedEyeIcon/>
              {/*<Badge theme="info">{views}</Badge>*/}
            </Button>}
            <Button onClick={() => {
              addBookmark(_id).then(res => {
                toast(t(res.message), {
                  type: "success"
                });
              }).catch(err => {
                  toast(t(err.message), {
                    type: "warning"
                  });
                }
              );

            }}><BookmarkAddIcon/></Button>

            {admin_token &&
            <Link to={"/admin/#/product/" + _id} class={"btn btn-primary"}>

              <EditIcon/>

            </Link>}
          </ButtonGroup>
        </div>
      </Row>
      <Row className={"limited posrel"}>
        <Col lg="6" md="12">
          <Row>
            <Col lg="12" md="12">


              <Gallery photos={photos} thumbnail={thumbnail}/>


            </Col>
          </Row>

        </Col>
        <Col lg="6" md="12">
          <Row>

          </Row>
          <Row className={""}>
            <div className={"bread-crumb"}>
              <div className={"allCatse mt-4"}>

                {firstCategory && firstCategory.name && firstCategory.name[lan] && [
                  <Link to={"/"}
                        className={"gfdcvgfd"} key={0}><span
                    className={"categories ml-1 mt-2"}>{t("home")}</span></Link>,
                  <Link to={"/"}
                        className={"gfdcvgfd"} key={1}><span className="material-icons">chevron_left</span></Link>,
                  <Link to={"/category/" + firstCategory._id + "/" + firstCategory.name[lan]}
                        className={"gfdcvgfd"} key={2}><span
                    className={"categories ml-1 mt-2"}>{firstCategory.name[lan]}</span></Link>]}
                {secondCategory && secondCategory.name && secondCategory.name[lan] &&
                [<Link to={"/category/" + secondCategory._id + "/" + secondCategory.name[lan]}
                       className={"gfdcvgfd"} key={0}><span className="material-icons">chevron_left</span></Link>,
                  <Link to={"/category/" + secondCategory._id + "/" + secondCategory.name[lan]}
                        className={"gfdcvgfd"} key={1}><span
                    className={"categories ml-1 mt-2"}>{secondCategory.name[lan]}</span></Link>]}
                {thirdCategory && thirdCategory.name && thirdCategory.name[lan] &&
                [<Link to={"/category/" + thirdCategory._id + "/" + thirdCategory.name[lan]}
                       className={"gfdcvgfd"} key={0}><span className="material-icons">chevron_left</span></Link>,
                  <Link to={"/category/" + thirdCategory._id + "/" + thirdCategory.name[lan]}
                        className={"gfdcvgfd"} key={1}><span
                    className={"categories ml-1 mt-2"}>{thirdCategory.name[lan]}</span></Link>]}
              </div>

            </div>
          </Row>
          <Row>
            <Col lg="12" md="12" className={"single-product"}>

              <h1 className="kjhghjk hgfd ">
                {title && title[lan]}
              </h1>
              {labels && <div className={"the-labeled"}>{labels.map((lab, k) => {
                return <div className={"the-label"} key={k}>{lab.title}</div>;
              })}</div>}


              {(excerpt && excerpt[lan]) && <div
                className="d-inline-block item-icon-wrapper mt-3 ki765rfg hgfd"
                dangerouslySetInnerHTML={{__html: excerpt[lan]}}
              />}

              {extra_button &&  <div className="AddToCardButton outOfStock">{extra_button}</div>}
              {!extra_button && type == "normal" && <div>
                {options && !options.length &&
                <><Theprice className={"single"} price={price} salePrice={salePrice} in_stock={in_stock}/></>}
                {!options && <><Theprice className={"single"} price={price} salePrice={salePrice} in_stock={in_stock}/></>}
                <SidebarActions className={"mobilenone "} add={false} edit={true} _id={_id} customer={customer}
                                updatedAt={updatedAt}
                                countryChoosed={countryChoosed}
                                type={type}
                                price={price}
                                salePrice={salePrice}
                                firstCategory={firstCategory}
                                secondCategory={secondCategory}
                                photos={photos}
                                title={title}
                                combinations={combinations}
                                options={options}
                                in_stock={in_stock}
                                quantity={quantity}
                                thirdCategory={thirdCategory}/>
              </div>}


            </Col>
          </Row>


        </Col>
        <Col lg={12} md={12} sm={12} xs={12}>
          {!extra_button && type == "variable" && <Row>
            <Col lg="12" md="12" className={"single-product mb-3"}>

              <SidebarActions className={"mobilenone "} add={false} edit={true} _id={_id} customer={customer}
                              updatedAt={updatedAt}
                              countryChoosed={countryChoosed} type={type} price={price}
                              firstCategory={firstCategory}
                              secondCategory={secondCategory}
                              photos={photos}
                              title={title}
                              combinations={combinations}
                              options={options}
                              in_stock={in_stock}
                              quantity={quantity}
                              thirdCategory={thirdCategory}
                              requireWarranty={requiredWarranty}

                              />

            </Col>
          </Row>}
        </Col>
        <Col lg={12} md={12} sm={12} xs={12} className={"mt-3 mb-5"}>

          <Row>
            <Col lg={3} md={3} sm={6} xs={6} className={"mb-3"}>
              <div>
              {/* <div className={"pro-icons-wrapper"}> */}
                <div className={"pro-icons"}>
                    <WarrantyIcon/>
                </div>
                <div className={"pro-icons-title"}>
                  ضمانت اصالت و سلامت فیزیکی
                </div>
              </div>
            </Col>
            <Col lg={3} md={3} sm={6} xs={6} className={"mb-3"}>
              <div >
              {/* <div className={"pro-icons-wrapper"}> */}

                <div className={"pro-icons"}>
                  <PersonInIcon/>
                </div>
                <div className={"pro-icons-title"}>
                  پرداخت حضوری و غیرحضوری
                </div>
              </div>
            </Col>
            <Col lg={3} md={3} sm={6} xs={6} className={"mb-3"}>
              {/* <div className={"pro-icons-wrapper"}> */}
              <div>

                <div className={"pro-icons"}>
                  {/* <DeliveryDiningIcon/> */}
                  {/* <img width={100} src={immediateIcon} alt={' امکان ارسال فوری'}/> */}
                  <ImideatlyIcon/>
                </div>
                <div className={"pro-icons-title"}>
                  امکان ارسال فوری
                </div>
              </div>
            </Col>
            <Col lg={3} md={3} sm={6} xs={6} className={"mb-3"}>
              {/* <div className={"pro-icons-wrapper"}> */}
              <div>

                <div className={"pro-icons"}>
                  {/* <SupportAgentIcon/> */}
                  {/* <img width={100} src={secureIcon} alt={' پرداخت امن'}/> */}
                  <SecurityIcon/>
                </div>
                <div className={"pro-icons-title"}>
                پرداخت امن
                </div>
              </div>
            </Col>


          </Row>
        </Col>
        <Col lg={12} md={12} sm={12} xs={12}>

          <Nav justified={true} tabs={true} className={"post-product-nav"}>
            <NavItem>
              <NavLink active={tab === "attributes"} href="#attributes"
                       onClick={() => setTab("attributes")}><EditAttributesIcon className={"ml-2"}/><span
                className={"d-xs-none"}>{t("attributes")}</span></NavLink>
            </NavItem>
            <NavItem>
              <NavLink active={tab === "description"} href="#description"
                       onClick={() => setTab("description")}><DescriptionIcon className={"ml-2"}/><span
                className={"d-xs-none"}>{t("description")}</span></NavLink>
            </NavItem>

            <NavItem>
              <NavLink active={tab === "comments"} href="#comments" onClick={() => setTab("comments")}><ReviewsIcon
                className={"ml-2"}/><span className={"d-xs-none"}>{t("comments")}</span></NavLink>
            </NavItem>
          </Nav>
        </Col>
        <Col lg={12} md={12} sm={12} xs={12}>

          {tab === "description" && <div className={"pt-5"} id={"description"}>
            {(description && description[lan]) && <div
              className="d-inline-block item-icon-wrapper ki765rfg  hgfd mb-5"
              dangerouslySetInnerHTML={{__html: description[lan]}}
            />}

          </div>}


          {tab === "attributes" && <div className={"pt-5"} id={"attributes"}>

            {extra_attr && <div className={"d-inline-block item-icon-wrapper ki765rfg hgfd"}>
              <table className="product-attributes">
                <tbody>
                {extra_attr.map((item, key) => {
                  return <tr className={"kjhgfdgh"} key={key}>
                    <th className={"gfdsa"}>{item.title}</th>
                    <td>
                      <div key={key}
                           className="d-inline-block item-icon-wrapper ki765rfg hgfd"
                           dangerouslySetInnerHTML={{__html: item.des}}/>
                    </td>
                  </tr>;
                })}
                </tbody>
              </table>
            </div>}
          </div>}

          {tab === "comments" && <div className={"pt-5"} id={"comments"}>
            <Comments id={the_id}/>
          </div>}

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
