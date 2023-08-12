import React, {useState,useEffect} from 'react';
import {withTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

import {dFormat, PriceFormat} from '#c/functions/utils';
import {addItem, MainUrl, removeItem} from '#c/functions/index';
import {defaultImg} from '#c/assets/index';
import store from "#c/functions/store";

function SiteStatus({onClick, item, t}) {
  let siteStatus = useSelector((st) => !!st.store.siteStatus);
  // let siteStatusMessage = useSelector((st) => !!st.store.siteStatusMessage);

  let [siteStatusMessage, setSiteStatusMessage] = useState(store.getState().store.siteStatusMessage || '');
  console.log('siteStatus', siteStatus,siteStatusMessage);
  // setTimeOut(()=>{
  //   setsiteStatus(store.getState().store.siteStatus || {});
  //
  // },5000)
  // undefined
  useEffect(()=>{
    console.log('store.getState().store.siteStatus',store.getState().store.siteStatus);
    console.log('siteStatus',siteStatus);
    // setSiteStatus(store.getState().store.siteStatus || {});

  },[siteStatus]);
  console.log('siteStatus',siteStatus);
  if (siteStatus) {
    return <></>;
  } else {
    if (siteStatusMessage) {
      return (
        <div
          className={"top-bar-alert false"}
        >
          <div
            className={"top-bar-alert-inner false"}
          >
            {siteStatusMessage}
          </div>
        </div>
      );
    } else {
      return <div
        className={"top-bar-alert false"}
      >
        <div
          className={"top-bar-alert-inner false"}
        >
        </div>
      </div>;
    }
  }
}

export default withTranslation()(SiteStatus);
