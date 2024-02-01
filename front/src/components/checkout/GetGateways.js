import { forwardRef, useImperativeHandle, useState } from 'react';
import { FormRadio } from 'shards-react';
// import { withTranslation } from 'react-i18next';

import useFetch from '@/hooks/useFetch';
import Loading from '../Loading';

/**
 * Renders a component that fetches and displays a list of payment gateways.
 * @param {Object} props - The component props.
 * @param {Function} props.setPaymentMethod - The function to set the selected payment method.
 * @returns {JSX.Element} The rendered component.
 */

const GetGateways = forwardRef((props, ref) => {
  const [choosed, setChoosed] = useState(0);
  const { data, isLoading, error } = useFetch({
    requestQuery: '/gateway?type=bank-gateway',
  });

  const gatewaysList = data.data ? data.data : [];

  const [paymentMethod, setPaymentMethod] = useState();

  console.log('tracecode#22 ', data);
  useImperativeHandle(ref, () => ({
    getGateway() {
      return paymentMethod ? paymentMethod : gatewaysList[0].slug;
    },
  }));

  return isLoading ? (
    <Loading />
  ) : error ? (
    <p>خطا</p>
  ) : (
    data.length !== 0 &&
    gatewaysList.map((gateway, index) => {
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
});

export default GetGateways;
