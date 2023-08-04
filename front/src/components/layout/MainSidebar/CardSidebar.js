import React, {useState} from "react";

import clsx from "clsx";
import {Button, Col, ListGroupItem} from "shards-react";
import {Link} from "react-router-dom";


import {useSelector} from "react-redux";
import {MainUrl, toggleCardbar, updateCard} from "#c/functions/index";

import {toast} from "react-toastify";
import {withTranslation} from "react-i18next";
import CardbarMainNavbar from "./CardbarMainNavbar";
import Swiper from "#c/components/swiper";

import store from "#c/functions/store";

// export const APP_VERSION = process.env.REACT_APP_VERSION_NUM;
const CardSidebar = ({props, t}) => {

// const function CardSidebar({props,t}) {
  const themeData = useSelector((st) => st.store.themeData);
  if (!themeData.currency) {
    themeData.currency = 'toman';
  }
  const cardVisible = useSelector((st) => !!st.store.cardVisible);
  const card = useSelector((st) => st.store.card);
  // console.log("card", card);
  const handleToggleCardbar = () => toggleCardbar(true);

  const classes = clsx("main-sidebar", "card-sidebar", "px-0", "col-12", cardVisible && "open");
  // let [card, setCard] = useState(store.getState().store.card);
  let [sum, setSum] = useState(0);
  let [lan, setLan] = useState(store.getState().store.lan || "fa");

  const removeItem = async (idx) => {
    console.log("removeItem", idx);
    // const {t} = await this.props;
    // let {card, sum} = await this.state;
    let arr = [];
    await card.forEach(async (c, i) => {

      if (idx !== i) {
        console.log(i, idx);
        await arr.push(c);

      } else if (idx === i) {
        sum -= (c.salePrice || c.price) * c.count;

      }
      return;
    });
    // console.log("cardddd", arr);
    if (sum < 0 || arr.length < 1) {
      sum = 0;
    }
    await updateCard(arr, sum).then(() => {

      // this.setState({
      //   card: arr,
      //   sum: sum
      // })
      setSum(sum);
      console.log("toasts,,", arr);

      toast(t("Item deleted!"), {
        type: "warning"
      });
    });


  };

  const addItem = async (idx) => {
    // let {card, sum} = await this.state;
    sum = 0;
    console.log("sum is", sum);
    let arr = [];
    await card.forEach(async (c, i) => {
      sum += (c.salePrice || c.price) * c.count;

      if (idx === i) {
        console.log(i, idx);
        c.count = c.count + 1;
        sum += (c.salePrice || c.price) * c.count;

      }
      await arr.push(c);

      return;
    });
    console.log("cardddd", arr);

    await updateCard(arr, sum).then(() => {
      // this.setState({
      //   card: arr,
      //   sum: sum
      // })
      setSum(sum);

    });

  };

  const handleToast = async () => {
    console.log("handleToast");
    toast(t("You did not add anything to cart!"), {
      type: "error"
    });
  };
  const minusItem = async (idx) => {
    // let {card, sum} = await this.state;
    sum = 0;
    console.log("sum is", sum);
    let arr = [];
    await card.forEach(async (c, i) => {

      sum += (c.salePrice || c.price) * c.count;

      if (idx === i) {
        console.log(i, idx);
        c.count = c.count - 1;
        sum -= (c.salePrice || c.price) * c.count;
        if (c.count === 0) {
          removeItem(idx);
          return;
        }
      }
      await arr.push(c);

      return;
    });
    console.log("cardddd", arr);

    await updateCard(arr, sum).then(() => {
      // this.setState({
      //   card: arr,
      //   sum: sum
      // })
      setSum(sum);

    });
  };
  const returnPrice = (price) => {
    if (themeData.tax && themeData.taxAmount) {
      let ta = parseInt(themeData.taxAmount)
      price = parseInt(((ta / 100) + 1) * parseInt(price))
    }
    if (price)
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + t(themeData.currency)
  }
  // console.log("card********************", card, classes);
  let tsum = 0;
  // return <></>/;
  return (
    <Col tag="aside" className={classes} lg={{size: 3}} md={{size: 4}}>
      <CardbarMainNavbar/>

      <div flush="true" className={"card-add"}>

        {(card && card.length > 0) && card.map((item, idx) => {
          let min = 1000;
          let max = 5000;
          tsum += item.count * (item.salePrice || item.price);
          return (<ListGroupItem key={idx} className="d-flex px-3 border-0 wedkuhg">
            <div className={"flex-1 txc"}>
              <div className={"bge"}>
                <Button className={" thisiscarda"} onClick={(e) => {
                  e.preventDefault();
                  addItem(idx).then(res => console.log(res));
                }}> <span className="material-icons">add</span></Button>
                <div className={"number"}>
                  {item.count}
                </div>
                <Button className={" thisiscarda"} onClick={(e) => {
                  e.preventDefault();

                  minusItem(idx).then(res => console.log(res));
                }}> <span className="material-icons">remove</span></Button>
              </div>
            </div>
            <div className={"flex-1 txc imgds mr-2 ml-2"}>
              <Swiper
                perPage={1}
                arrows={false}
                interval={Math.floor(min + Math.random() * (max - min + 1))}
                breakpoints={{
                  1024: {
                    perPage: 1
                  },
                  768: {

                    perPage: 1
                  },
                  640: {

                    perPage: 1
                  },
                  320: {
                    perPage: 1
                  }
                }}
                className={"p-0 m-0"}
              >
                {(item.photos && item.photos.map((ph, phk) => {
                  return <img key={phk} className={"gfdsdf"} src={MainUrl + "/" + ph}/>;

                }))}
              </Swiper>
            </div>
            <div className={"flex-8 mr-2"}>
              <div className={"ttl"}>{item.title[lan]}</div>
              {(item.price && !item.salePrice) && <div
                className={"prc"}>{returnPrice(item.price)}</div>}
              {(item.price && item.salePrice) && <div
                className={"prc"}>{returnPrice(item.salePrice)}
                <del
                  className={"ml-2"}>{returnPrice(item.price)}</del>
              </div>}
            </div>
            <div className={"flex-1"}>
              <Button className={"notred smallx"} onClick={() => {
                removeItem(idx).then(res => console.log(res));
              }}> <span className="material-icons">delete</span></Button>
            </div>
          </ListGroupItem>);
        })}
      </div>
      <div className={"fdsdf pl-3 pr-3"} onClick={handleToggleCardbar}>
        {card && card.length > 0 && <Link
          to={"/checkout"}
          className={"go-to-checkout ml-auto ffgg btn btn-accent btn-lg mt-4 posrel textAlignLeft"}>
          <span className={"gfdfghj"}>{t("Checkout")}</span>
          <span className={"juytrftyu"}>
          {tsum && <span
            className={"ttl gtrf"}>{returnPrice(tsum)}</span>}
        </span>
        </Link>}
        {!card || !card.length && <Button
          onClick={() => handleToast}
          // to={'/'}
          className={"go-to-checkout-without-items ml-auto ffgg btn btn-accent btn-lg mt-4 posrel textAlignLeft"}>
          <span className={"gfdfghj"}>{t("Checkout")}</span>
          <span className={"juytrftyu"}>
          {tsum && <span
            className={"ttl gtrf"}>{returnPrice(tsum)}</span>}
        </span>
        </Button>}
      </div>
    </Col>
  );
};
export default withTranslation()(CardSidebar);

