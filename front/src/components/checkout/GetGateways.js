import React, { useEffect, useState } from 'react';
import { FormRadio, ListGroupItem } from 'shards-react';
import { withTranslation } from 'react-i18next';
import { getEntities } from '#c/functions/index';

// import State from "#c/data/state";

function GetGateways(props) {
  let {setGateway}=props;
  const [gateways, setGateways] = useState(null);

  const [theGateway, setTheGateway] = useState(null);


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
        r.forEach((gt, k) => {
          if (k == 0) {
            console.log('setGatewaySlug', gt.slug)
            setGateway(gt.slug);
          //  setTheGateway(gt.slug);
          }
        });
        setGateways(r);
        // }
      });
  }, []);


  // useEffect(() => {
  //   console.log('useEffect:',theGateway);
  //   setGateway(theGateway);
  // }, [setGateway, theGateway]);
  if (!gateways) {
    return null;
  }
  return gateways.map((gt, k) => {
    // if (k == 0) {
    //   console.log('setGatewaySlug',gt.slug)
    //   setGatewaySlug(gt.slug);
    // }
    if(gt.type=='bank-gateway')
    return (
      <div className={'d-flex ' + gt.slug} key={k}>
        {' '}
        <FormRadio
          checked={k === choosed}
          onChange={(event) => {
            console.log('props', props);
            setChoosed(k);
            setGateway(gt.slug);
          //  setTheGateway(gt.slug);
          //  setGatewaySlug(gt.slug);
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
