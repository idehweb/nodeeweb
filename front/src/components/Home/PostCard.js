import React from "react";
import { withTranslation } from "react-i18next";
import _truncate from "lodash/truncate";
import { Link } from "react-router-dom";
import Theprice from "#c/components/single-post/Theprice";
import SidebarActions from "#c/components/single-post/SidebarActions";

import { dFormat, PriceFormat } from "#c/functions/utils";
import { addItem, MainUrl, removeItem } from "#c/functions/index";
import { defaultImg } from "#c/assets/index";
// import store from "#c/functions/store";
import AddToCardButton from "#c/components/components-overview/AddToCardButton";

function PostCard({ onClick, item, method, t }) {
  // return
  // let card = store.getState().store.card || [];
  let date = dFormat(item.updatedAt, t);
  let price = null;
  let salePrice = null;
  if (item.price) price = PriceFormat(item.price);
  if (item.salePrice) salePrice = PriceFormat(item.salePrice);
  let backgroundImage = defaultImg;
  if (item.photos && item.photos[0])
    backgroundImage = MainUrl + "/" + item.photos[0];
  if (item.thumbnail)
    backgroundImage = MainUrl + "/" + item.thumbnail;
  // let title = encodeURIComponent(item.title.fa.replace(/\\|\//g, ""));
  let slug = item.slug;
  let cat_inLink=slug;
  if(item.firstCategory) {
     cat_inLink = item.firstCategory.slug;
    if (item.secondCategory && item.secondCategory.slug)
      cat_inLink = item.secondCategory.slug;
    if (item.thirdCategory && item.thirdCategory.slug)
      cat_inLink = item.thirdCategory.slug;
  }
  cat_inLink='product/'+slug;
  // console.log('item.labels', item.labels);
  return (
    <div
      className="mb-4 ad-card-col nbghjk"
    >
      <div
        className="ad-card-main-div"
      >
        {(item.labels && item.labels.length > 0) && <div className={"the-labels"}>{item.labels.map((lab, k) => {
          return <div className={"the-label"} key={k}>{lab && lab.title}</div>;
        })}</div>}
        <div
          className="card-post__image"
          onClick={onClick}
        ><Link to={"/" + cat_inLink + "/"}><img alt={item.title ? item.title["fa"] : ''} loading={"lazy"} src={
          backgroundImage || defaultImg
        }/></Link></div>
        <div className={"post-content-style"}>
          <div className="ad-card-content">

            <div>
              {item.body && <p className="card-text">{item.body}</p>}
              <div className={"wer"}>

              </div>

              {(item.type === "normal" && item.in_stock) &&
              <Theprice price={price} salePrice={salePrice} single={false}/>}
              {item.type === "variable" &&
              <Theprice price={price} salePrice={salePrice} combinations={item.combinations} type={item.type}
                        single={false}/>}

            </div>
            <span className="a-card-title">
            <Link to={"/" + cat_inLink + "/"}>{_truncate(item.title["fa"], { length: 120 })}</Link>
          </span>

          </div>
          {method === "list" && <>
            {item.type === "variable" &&
            <div className={"single-product mb-3"}>
              <SidebarActions className={"mobilenone "}
                              add={false}
                              edit={true}
                              _id={item._id}
                              customer={item.customer}
                              updatedAt={item.updatedAt}
                              countryChoosed={item.countryChoosed}
                              type={item.type}
                              price={item.price}
                              firstCategory={item.firstCategory}
                              secondCategory={item.secondCategory}
                              photos={item.photos}
                              title={item.title}
                              combinations={item.combinations}
                              options={item.options}
                              in_stock={item.in_stock}
                              quantity={item.quantity}
                              thirdCategory={item.thirdCategory}
                              method={method}
                              single={false}
              />

            </div>}
          </>}
          {method !== "list" && <>{item.type === "variable" &&
          <AddToCardButton item={item} text={t("options")} variable={true}>
            {(item.options && item.options.length > 0) &&
            <div className={"show-options"}><Link to={"/" + cat_inLink + "/"}>
              <ul>
                {item.options.map((comb, c) => {
                  let string = [];
                  if (comb.values) {
                    comb.values.map((val, ct) => {
                      // console.log('val',val.name);

                      string.push(<li key={ct}>{val.name && (val.name.fa ? val.name.fa : (typeof val.name == 'string' ? val.name : ''))}</li>);
                      // return <div className={'option-name'}>{val.name.join('\n')}</div>;
                    });
                  }

                  return string;
                })}
              </ul>
            </Link>
              <div className={"underbar-triangle"}></div>
            </div>}
          </AddToCardButton>}
                                  {item.type === "normal" && <AddToCardButton item={item}/>}</>}
        </div>
      </div>
    </div>
  );
}

export default withTranslation()(PostCard);
