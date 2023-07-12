import React, { useCallback, useEffect, useState } from 'react';
import { useDataProvider } from 'react-admin';

import { numberWithCommas } from '@/functions';

const DollarPrice = () => {
  const [state, setState] = useState({});
  // const version = useVersion();
  const dataProvider = useDataProvider();

  const fetchPriceDollar = useCallback(async () => {
    const { data: Data } = await dataProvider.get('settings/dollar', {});
    console.log('dollar', Data);

    if (Data && Data.dollarPrice && Data.derhamPrice) {
      console.log(Data.dollarPrice);
      setState((state) => ({
        ...state,
        priceDollar: Data.dollarPrice,
        priceDerham: Data.derhamPrice,
      }));
    }
  }, [dataProvider]);

  // useEffect(() => {
  //     fetchPriceDollar();
  // }, [version]);

  const { priceDollar, priceDerham } = state;
  return [
    <div key={0}>
      {priceDollar && [
        <span className={'labelofdollarPrice'}>قیمت دلار:</span>,
        <span className={'dollarPrice'}>
          {numberWithCommas(priceDollar) + ' تومان'}
        </span>,
      ]}
    </div>,
    <div key={1}>
      {priceDerham && [
        <span className={'labelofdollarPrice'}>قیمت درهم:</span>,
        <span className={'dollarPrice'}>
          {numberWithCommas(priceDerham) + ' تومان'}
        </span>,
      ]}
    </div>,
  ];
};

export default DollarPrice;
