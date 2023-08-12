import React, {useState} from "react";
import {withTranslation} from "react-i18next";
import {Button, FormInput,} from 'shards-react';
import {toast} from "react-toastify";

import {dFormat, PriceFormat} from "#c/functions/utils";
import {addItem, getDiscountCode, MainUrl, removeItem} from "#c/functions/index";
import {defaultImg} from "#c/assets/index";
import {store} from "#c/functions/store";

function GetDiscount({price, setDiscount, order_id, children, t,setDiscountCode=(e)=>{}}) {
  console.log('order_id', order_id);
  let [dis, setDis] = useState('');
  return (
    <div className="PriceChunker">
      <div className={'s mb-2 posrel'}>
        <FormInput
          size={'sm'}
          id="feFirstName"
          value={dis}
          onChange={(event) => {
            setDis(event.target.value)
          }}
        />

        <Button size="sm left" className={'set-discount ghvhvghv'} left={"true"} onClick={(e) => {
          console.log('order_id', dis, order_id)

          getDiscountCode(dis, order_id).then(r => {
            console.log('r.price', r.price, r.percent, order_id)
            if (r.percent)
              setDiscount(r.percent, 'percent',dis);
            if (r.price)
              setDiscount(r.price, 'price',dis);

              setDiscountCode(dis)

            toast(t("successfully done!"), {
              type: "success"
            });
          }).catch(er => {
            console.log('er',er)
            toast(t((er && er.message) ? er.message : "Code is wrong!"), {
              type: "warning"
            });
          });
        }}>{t('get discount')}</Button>
      </div>
      {children}
    </div>
  );
}

export default withTranslation()(GetDiscount);
