import React, { useEffect, useState } from 'react';
import { FormRadio, ListGroupItem } from 'shards-react';
import { withTranslation } from 'react-i18next';
import { getEntities } from '#c/functions/index';

// import State from "#c/data/state";

function GetGateways(prop) {
  let {setPaymentMethod}=prop;
  const [gateways, setGateways] = useState(null);
  const [choosed, setChoosed] = useState(0);

  useEffect(() => {
    if (!gateways)
      getEntities(
        'gateway',
        0,
        10,
        false,
        JSON.stringify({ type: 'bank-gateway' })
      ).then((r) => {
        r=r.data;
        console.log('r',r);

        // if (r && r.tables) {
        //     console.log('r.tables', r.tables)
        // setPaymentMethod(r[0].slug);

        setGateways(r);
        // }
      });
  }, []);
  if (!gateways) {
    return null;
  }
  return gateways.map((gt, k) => {
    if (k == 0) {
    }
    if(gt.type=='bank-gateway')
    return (
      <div className={'d-flex ' + gt.slug} key={k}>
        {' '}
        <FormRadio
          checked={k === choosed}
          onChange={(event) => {
            console.log('prop', prop);
            setChoosed(k);
            // prop.setPaymentMethod(gt.slug);
          }}
          className="mb-0 ">
          {gt?.title?.fa}
          {gt?.name}
        </FormRadio>
      </div>
    );
    else{
      return <></>
    }
  });
}

export default withTranslation()(GetGateways);
