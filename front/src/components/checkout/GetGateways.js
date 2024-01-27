import { useState } from 'react';
import { FormRadio } from 'shards-react';
import { withTranslation } from 'react-i18next';

import useFetch from '@/hooks/useFetch';
import Loading from '../Loading';

// import State from "#c/data/state";

function GetGateways({ setPaymentMethod }) {
  const [choosed, setChoosed] = useState(0);

  const { data, isLoading, error } = useFetch({
    requestQuery: '/gateway?type=bank-gateway',
  });

  console.log('tracecode#22 ', data);

  return isLoading ? (
    <Loading />
  ) : error ? (
    <p>خطا</p>
  ) : (
    data.length !== 0 &&
    data.data.map((gateway, index) => {
      return (
        <div className={'d-flex ' + gateway.slug} key={index}>
          <FormRadio
            checked={index === choosed}
            onChange={(event) => {
              setChoosed(index);
              setPaymentMethod(gateway.slug);
            }}
            className="mb-0 ">
            {gateway.description['fa']}
          </FormRadio>
        </div>
      );
    })
  );
}

export default withTranslation()(GetGateways);
