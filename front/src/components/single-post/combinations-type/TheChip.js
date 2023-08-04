import React, {useEffect, useState} from "react";
import store from "#c/functions/store";
// import Swiper from "#c/components/swiper";
import {getCombination, getPosts, getPostsByCat, handleTitles, MainUrl} from "#c/functions/index";
// import PostCard from "#c/components/Home/PostCard";
import _ from 'lodash'

import {withTranslation} from "react-i18next";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Theprice from "#c/components/single-post/Theprice";
import {isEqual} from "../../../functions";
import AddToCardButton from "#c/components/components-overview/AddToCardButton";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
// import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import AlertPopup from "#c/components/components-overview/AlertPopup";
const theChip = (props) => {
  
  let [showPop, setShowPop] = useState(false);
  const onSelectWarranty =(e)=>{
    setShowPop(e)
  }
  const {
    combinations,
    options,
    showPrice = () => {
    },
    single,
    photos,
    _id,
    method,
    title,
    t,
    requireWarranty
  } = props;
  // return JSON.stringify(options)
  let allOptions = [];

  let choosed = combinations[0], doptions =combinations[0].options, lessPrice = combinations[0].salePrice || combinations[0].price,dstock=combinations[0].in_stock;
  _.forEach(combinations, (combination, j) => {
    let pr = combination.salePrice || combination.price
    let st = combination.in_stock;
    if(!dstock && st){
      lessPrice = pr;
      choosed = combination;
      doptions = combination.options;
      dstock = st;
    }
    if (pr < lessPrice && st) {
      lessPrice = pr;
      choosed = combination;
      doptions = combination.options;
    }
// if(st)
  })
  // return JSON.stringify(lessPrice);
  const [lan, setLan] = useState(store.getState().store.lan);
  const [actives, setActives] = useState(doptions || {});
  const [count, setCount] = useState(options.length);
  const [theCombination, setTheCombination] = useState(choosed || {});
  const [canBuy,setCanBuy] = useState(false);
  const onClickChip = (name, e) => {
    // if(requireWarranty){
    //   if(e.name != 'گارانتی اصالت و سلامت فیزیکی'){
    //     setCanBuy(true)
    //   }else{
    //     setCanBuy(false)
    //   }
    // }

      let obj = {...actives};
      obj[name] = e.name;
      combinations.forEach((comb) => {
        if (isEqual(comb.options, obj)) {
          console.log("comb", comb);
          setTheCombination(comb);
        }
      });
      setActives(obj);
      showPrice(obj);
  };

  useEffect(() => {
    console.log("useEffect...", actives);
    showPrice(actives);
    // loadProductItems();
  }, []);

  let inS = ((theCombination.in_stock == "0" || theCombination.in_stock == null) ? false : true);
  return (
    [<div className={" mt-5 the-chip row"} key={0}>
      {
        !requireWarranty && (
          <label className={"the-label-inline bigger"}>{t("please choose combination") + ":"}</label>
        )
      }

        {
        showPop && (
          <AlertPopup
           title={t("please choose combination") + ":"} canBuy={canBuy} show={showPop}  onHandler={(e)=>setShowPop(e)}
           item={{
            _id: _id + "DDD" + theCombination.id,
            title: {
              [lan]: title[lan] + " - " + handleTitles(theCombination)
            },
            photos: photos,
            single: true,
            in_stock: inS,
            quantity: parseInt(theCombination.quantity),
            price: theCombination.price,
            type: "variable",
            // comb_id:comp.id,
            salePrice: theCombination.salePrice
          }}
           >
             <section style={{paddingBottom:'10px',borderBottom:'1px solid #e3e3ea'}}>
                <div className={"the-chip row"} style={{fontFamily: 'IRANSans'}} key={1}>
                  
                {options && options.map((opt, k) => {
                                      return <ChipInside showTitle={false} key={k} opt={opt} actives={actives} onClickChip={(e) => {
                                        onClickChip(opt.name, e);
                                      }}/>;
                      })}
                </div>
                    
                      <div className={"gfd"} style={{marginTop:'20px',float:'left',color:'#3e3f64'}}>
                          <Theprice className={" single-let " + theCombination.salePrice + " - " + theCombination.price}
                                    price={theCombination.price}
                                    in_stock={inS}
                                    salePrice={theCombination.salePrice}/>
                                    
                      </div>
                      <div className="clearfix"></div>
             </section>
             <section>
            <span
            style={{
             fontSize: '1rem',
             fontWeight: '700',
             color:'#070935',
             display:'block',
             width:'100%',
             padding:'0px 5px',
             marginTop:'5px',
             fontFamily: 'IRANSans'
           }}
            >تفاوت گارانتی‌های مختلف آروند چیست؟</span>
            <p
            style={{
              fontSize: '12px',
              fontWeight: '400',
              color:'#777891',
              width:'100%',
              padding:'5px 5px',
              fontFamily: 'IRANSans'
            }}
            >
            آروند برروی کالاهای خود علاوه‌بر گارانتی اصالت و سلامت فیزیکی، دو گارانتی ۱۸ ماهه سبز آروند و ۱۸ ماهه طلایی آروند همراه با پوشش حوادث را ارائه می‌دهد.
ضمانت سبز آروند فقط مشکلات خود به خودی دستگاه را پوشش می‌دهد. اما ضمانت تکمیلی طلایی، علاوه بر مشکلات خود به خودی دستگاه، تمام حوادث وارده توسط فرد را هم تحت پوشش خود قرار می‌دهد.
            </p>
          </section>
            </AlertPopup>
        )
      }

    </div>,
      <div className={" mt-2 the-chip row"} key={1}>
        <div className={"col-md-8"}>
           {options &&   options.map((opt, k) => {
                return <ChipInside showTitle={true} key={k} opt={opt} actives={actives} onClickChip={(e) => {
                  onClickChip(opt.name, e);
                }}/>;
            })}
        </div>
        <div className={"col-md-4"}>{Boolean(theCombination) && <div className={"the-option-price text-center"}>

          <div className={"gfd"}>
            {/*{theCombination.price}/*/}
            <Theprice className={"single single-let " + theCombination.salePrice + " - " + theCombination.price}
                      price={theCombination.price}
                      in_stock={inS}
                      salePrice={theCombination.salePrice}/>
          </div>
            {
              requireWarranty && !canBuy ? (
                <button
                  style={{
                    height: '40px',
                    width: '80%',
                    margin: 'auto',
                    lineHeight: '40px',
                    minWidth: '130px',
                    background: '#17c671',
                    color: '#fff',
                    fontWeight: 'bold',
                    display: 'flex',
                    flexDirection:'row-reverse',
                    justifyContent: 'center',
                    borderColor:'#17c671',
                    border:'none',
                    borderRadius:'4px',
                    fontSize:'17px'
                  }}
                  onClick={()=>{
                    setShowPop(true)
                  }}    
                >
                    خرید
                </button>
              ):(
              <>
                {inS  && method === "list" && !single && <>
                <div className={"the-option-actions " + inS}>
                  <AddToCardButton  item={{
                    _id: _id + "DDD" + theCombination,
                    title: {
                      [lan]: title[lan] + " - " + handleTitles(theCombination)
                    },
                    // mainTitle: title,
                    photos: photos,
                    single: true,
                    in_stock: inS,
                    quantity: parseInt(theCombination.quantity),
                    price: theCombination.price,
                    type: "variable",
                    // comb_id:comp.id,
                    salePrice: theCombination.salePrice
                  }}/>
                </div>
              </>}
              {single  && <>
                <div className={"the-option-actions " + inS}>
                {/* <span style={{color:'red',cursor:'pointer'}} onClick={()=>setShowPop(true)}>تغییر گارانتی</span> */}
                  <AddToCardButton   item={{
                    _id: _id + "DDD" + theCombination.id,
                    title: {
                      [lan]: title[lan] + " - " + handleTitles(theCombination)
                    },
                    photos: photos,
                    single: true,
                    in_stock: inS,
                    quantity: parseInt(theCombination.quantity),
                    price: theCombination.price,
                    type: "variable",
                    // comb_id:comp.id,
                    salePrice: theCombination.salePrice
                  }}/>
                </div>
              </>}
              </>
              )
            }  





        </div>}
        </div>
      </div>]
  );
};
const ChipInside = ({opt, actives, onClickChip,showTitle}) => {
  // return JSON.stringify(props)
  let [state, setState] = useState({});
  const onClick = (val) => {
    onClickChip(val);
  };

  return (
    <Stack direction="row" className={" mt-2 wrap-stack"} spacing={1}>
      {
        showTitle &&(
          <label className={"the-label-inline"} style={{width:'100%'}}>{opt.name + ":"}</label>
        )
      }
      
      
      {(opt.values && opt.values.length) &&
      (opt.values).map((val, j) => {
          // if(val.name != 'گارانتی اصالت و سلامت فیزیکی'){
            return <Chip
            style={{fontFamily: 'IRANSans'}}
              key={j}
              icon={(actives && (actives[opt.name] === val.name)) ? <RadioButtonCheckedIcon style={{marginRight:'10px'}}/> : <RadioButtonUncheckedIcon style={{marginRight:'10px'}}/>}
              variant={(actives && (actives[opt.name] === val.name)) ? "filled" : "outlined"}
              className={(actives && (actives[opt.name] === val.name)) ? "active" : ""} label={val.name}
              onClick={(e) => {
                // Object.assign(val,{key:j})
                onClick(val);
              }}/>;
          // }
      })}


    </Stack>
  );
};

export default withTranslation()(theChip);
