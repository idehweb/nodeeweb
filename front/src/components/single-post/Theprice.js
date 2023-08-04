import React from "react";
import {withTranslation} from "react-i18next";
import {addBookmark, arrayMin, getContactData, getMinPrice} from "#c/functions/index";
import {store} from "#c/functions/store";
import {useSelector} from "react-redux";

import {dFormat, NormalizePrice, PriceFormat} from "#c/functions/utils";

const Theprice = (props) => {
  // return 'kir'

  let {price, salePrice, t, className, combinations, type} = props;
  // return price;

  if (price)
    price = NormalizePrice(price);
  if (salePrice)
    salePrice = NormalizePrice(salePrice);

  // return (JSON.stringify(salePrice )+"==>"+JSON.stringify(price))

  // return price;
  const themeData = useSelector((st) => st.store.themeData);
// return themeData.currency
//   if (price == 0 || price == null) {
//     console.log("error...", price);
//
//     return <></>;
//   }
  if (combinations && combinations[0]) {
    // return 'x'
    // return 'x'

    let lessPrice = null
    if (combinations[0].price && combinations[0].price != '' && combinations[0].price != null)
      lessPrice = combinations[0].price
    if (combinations[0].salePrice && combinations[0].salePrice != '' && combinations[0].salePrice != null)
      lessPrice = combinations[0].salePrice
    let dstock = combinations[0].in_stock;
    let st;
    let pr = null;

    _.forEach(combinations, (combination, j) => {

      if (combination.price && combination.price != '' && combination.price != null)
        pr = combination.price
      if (combination.salePrice && combination.salePrice != '' && combination.salePrice != null)
        pr = combination.salePrice

      st = combination.in_stock;
      if(!lessPrice && pr){
        lessPrice=pr;
        salePrice = combination.salePrice;
        price = combination.price;
      }
      console.log('pr', pr, 'lessPrice', lessPrice)
      if (pr < lessPrice || (pr == lessPrice && j == 0)) {
        salePrice = combination.salePrice;
        price = combination.price;
        lessPrice = salePrice || price;
      }
      // return JSON.stringify(Boolean(!dstock && st))
      // if (!dstock && st) {
      //   lessPrice = pr;
      //   salePrice = combination.salePrice;
      //   price = combination.price;
      //
      // }
      // if (dstock && st) {
      //   lessPrice = pr;
      //   salePrice = combination.salePrice;
      //   price = combination.price;
      //
      // }
      // return JSON.stringify(pr)
      // console.log('#j'+j,'pr:',pr,'lessPrice:',lessPrice)
      // if (pr < lessPrice && st) {
      //   lessPrice = pr;
      //   price = pr;
      //   salePrice = combination.salePrice;
      //   price = combination.price;
      // }
      // console.log('#j'+j,'pr:',pr,'lessPrice:',lessPrice,price)

// if(st)
    })
  }
  if (!themeData.currency) {
    themeData.currency = 'toman';
  }
  if (themeData.tax && themeData.taxAmount) {
    let ta = parseInt(themeData.taxAmount)
    // price= 100
    // x = 9
    // 9/100 * price + price
    // ((0.09)+ 1) * price
    if (price)
      price = parseInt(((ta / 100) + 1) * parseInt(price))
    if (salePrice)
      salePrice = parseInt(((ta / 100) + 1) * parseInt(salePrice))
// price=ta;
//     salePrice=ta;
    //   themeData.taxAmount = 'toman';
  }
  if (price) price = PriceFormat(price);
  else
    price = null
  if (salePrice) salePrice = PriceFormat(salePrice);
  else
    salePrice = null
  return (
    <div className={"thePrice rtl " + className}>
      {/*{price}*/}
      {/*{type}*/}
      {/*{salePrice}*/}
      <div className={"only-price"}> {Boolean(!salePrice && price != null) &&
      <div className={"wer  mt-2 pandnotsp"}>
                <span className="card-non-title-item">
                          {(type === "variable" && t("from"))}
                  <span className={"mr-2"}>{price + " " + t(themeData.currency)}</span>
                </span>
      </div>
      }</div>
      <div className={"with-sale-price"}>{Boolean(salePrice && salePrice !== null) && (
        <div className={"wer  mt-2 pandsp"}>
                <span className="card-non-title-item">
                  {salePrice + " " + t(themeData.currency)}
                </span>
          <span className="card-non-title-item ml-2">
                  <del>{price + " " + t(themeData.currency)}</del>
                </span>
        </div>
      )}
      </div>
    </div>
  );

};

class Theprice_old extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // phoneNumber: '',
      // email: '',
      // lan: store.getState().store.lan,
      // optionsId: {},
      // combinationsTemp: {},

    };
  }


  render() {
    let {price, salePrice, t, className, combinations, type} = this.props;
    if (price) price = PriceFormat(price);
    if (salePrice) salePrice = PriceFormat(salePrice);
    // console.log("salePrice", salePrice);
    // price = getMinPrice(combinations);
    // console.log("price2", price);

    if (price == 0 || price == null) {
      console.log("error...", price);

      return <></>;
    }
    // console.log("price3", price);
// return 'false'
    return (
      <div className={"thePrice rtl " + className}>
        {/*{price}*/}
        {/*{salePrice}*/}
        <div className={"only-price"}> {Boolean(!salePrice && price != null) &&
        <div className={"wer  mt-2 pandnotsp"}>
                <span className="card-non-title-item">
                          {(type === "variable" && t("from"))}
                  <span className={"mr-2"}>{price + " " + t(themeData.currency)}</span>
                </span>
        </div>
        }</div>
        <div className={"with-sale-price"}>{Boolean(salePrice && salePrice !== null) && (
          <div className={"wer  mt-2 pandsp"}>
                <span className="card-non-title-item">
                  {salePrice + " " + t(themeData.currency)}
                </span>
            <span className="card-non-title-item ml-2">
                  <del>{price + " " + t(themeData.currency)}</del>
                </span>
          </div>
        )}
        </div>
      </div>
    );
  }
}

export default withTranslation()(Theprice);
