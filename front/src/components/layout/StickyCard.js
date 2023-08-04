import React, { useState } from "react";
import { Button } from "shards-react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { store } from "#c/functions/store";
import { toggleCardbar } from "#c/functions/index";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
const StickyCard = ({ t }) => {
  // console.clear();
  console.log("StickyCard");
  let count=0;
  const cardVisible = useSelector((st) => !!st.store.cardVisible);
  let card = useSelector((st) => st.store.card || []);
  let sum = useSelector((st) => st.store.sum || 0);
  // let [count, setcount] = useState(card.length || 0);
  // let [Sum, setSum] = useState(0);


  const handleToggleCardbar = () => toggleCardbar(cardVisible);

  // useEffect(() => {
  console.log("useEffect card", card, sum);
  // setcount(card.length);
  count=(card.length);
  sum = 0;
  card.forEach((item, i) => {
    sum += item.count * (item.salePrice || item.price);
  });
  // setSum(sum);

  // }, [card]);
  // useEffect(() => {
  console.log("useEffect card", sum,count);
  // }, [sum]);
  return (
    <div className="sticky-card " onClick={handleToggleCardbar}>
      <Button>
        <div className={"efcvedf"}>
          <ShoppingBagIcon/>
          {count}<span className={"ml-1 mr-2"}>{t("item")}</span>
        </div>
        <div className={"juytrftyu"}>
          {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + t(" UZS")}
        </div>
      </Button>
    </div>
  );
};

export default withTranslation()(StickyCard);
