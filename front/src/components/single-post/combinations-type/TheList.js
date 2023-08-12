import React, { useEffect, useState } from "react";
import store from "#c/functions/store";

// import Swiper from "#c/components/swiper";
import { getCombination, getPosts, getPostsByCat, MainUrl,handleTitles } from "#c/functions/index";
// import PostCard from "#c/components/Home/PostCard";
import { withTranslation } from "react-i18next";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Theprice from "#c/components/single-post/Theprice";
import { isEqual } from "../../../functions";
import AddToCardButton from "#c/components/components-overview/AddToCardButton";

// import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
const TheList = (props) => {
  // console.log("props", props);
  const {
    combinations,
    options,
    showPrice = () => {},
    single,
    photos,
    _id,
    method,
    title

  } = props;
  let allOptions = [];

  // console.log("allOptions", allOptions);
  const [lan, setLan] = useState(store.getState().store.lan);

  const [actives, setActives] = useState({});
  const [count, setCount] = useState(options.length);
  const [theCombination, setTheCombination] = useState([]);

  // const goToPage = (post) => {
  //
  // };
  //
  const onClickChip = (name, e) => {
    // console.log("onClickChip");
    // console.log(count);
    // console.log(name, ":", e.name);
    let obj = { ...actives };
    obj[name] = e.name;
    // let co=getCombination(combinations,obj);
    combinations.forEach((comb) => {
      // console.log('condition',condition,Object.is(comb.options,condition));

      if (isEqual(comb.options, obj)) {
        console.log("comb", comb.price, comb.quantity);
        setTheCombination(comb);
      }
    });
    setActives(obj);
    showPrice(obj);
    console.log("combination", theCombination);
  };
  // const loadProductItems = async () => {
  //
  //   // getPosts(0, 12,'').then((resp) => {
  //   //   // setLoadingMoreItems(false);
  //   //   // afterGetData(resp);
  //   //   settracks(resp);
  //   //
  //   // });
  //   getPostsByCat(0, 12, cat_id, "").then((resp) => {
  //     settracks(resp);
  //
  //   });
  //
  //   // }
  // };
  const handleOptions = (combination) => {
    // const { t, options } = this.props;
    let arr = [];
    if (combination && combination.options) {
      Object.keys(combination.options).forEach(function(op, index) {
        if (combination.options[op])
          arr.push(<div className={"option-title"} key={index}>
            <span>{op}</span><span>:</span><span>{combination.options[op]}</span>
          </div>);
      });
    }
    return arr;
  };
  useEffect(() => {
    // loadProductItems();
  }, []);

  // console.clear();
  // console.log("actives", actives);
  if(combinations)
  return combinations.map((comp, key) => {
    let inS = ((comp.in_stock == "0" || comp.in_stock == null) ? false : true);
    if (!inS && !single)
      return;
    return (<div key={key} className={"option-wrap posrel"}>
      <div className={"the-option-title"}>{handleOptions(comp)}</div>
      <div className={"the-option-left-box"}>
        <div className={"the-option-price"}>
          <Theprice className={"single single-let " + comp.salePrice + " - " + comp.price} price={comp.price}
                    in_stock={inS}
                    salePrice={comp.salePrice}/>
        </div>
        {inS && method === "list" && !single && <>
          <div className={"the-option-actions " + inS}>
            <AddToCardButton item={{
              _id: _id + "DDD" + comp.id,
              title: {
                [lan]: title[lan] + " - " + handleTitles(comp)
              },
              // mainTitle: title,
              photos: photos,
              single: true,
              in_stock: inS,
              quantity: parseInt(comp.quantity),
              price: comp.price,
              type: "variable",
              // comb_id:comp.id,
              salePrice: comp.salePrice
            }}/>
          </div>
        </>}
        {single && <>
          <div className={"the-option-actions " + inS}>
            <AddToCardButton item={{
              _id: _id + "DDD" + comp.id,
              title: {
                [lan]: title[lan] + " - " + handleTitles(comp)
              },
              photos: photos,
              single: true,
              in_stock: inS,
              quantity: parseInt(comp.quantity),
              price: comp.price,
              type: "variable",
              // comb_id:comp.id,
              salePrice: comp.salePrice
            }}/>
          </div>
        </>}
      </div>
      <div className=" hr-bottom"></div>
    </div>);
  })
  else
    return <></>
};
const ChipInside = ({ opt, actives, onClickChip }) => {
  let [state, setState] = useState({});
  const onClick = (val, j) => {
    // console.log(val, j);
    onClickChip(val);
    // setState({...state,})
  };
  return (
    <Stack direction="row" className={" mt-2"} spacing={1}>
      {(opt.values && opt.values.length) &&
      (opt.values).map((val, j) => {
        return <Chip className={(actives && (actives[opt.name] === val.name)) ? "active" : ""} label={val.name}
                     onClick={(e) => {
                       onClick(val, j);
                     }}/>;
      })}


    </Stack>
  );
};

export default withTranslation()(TheList);
