// import React from 'react';

// import { useForm } from 'react-hook-form';

import { BooleanInput, Loading, SimpleForm, TextInput } from 'react-admin';

import useFetch from '@/hooks/useFetch';

export interface WebAppConfigProps {
  app_name: string;
  consumer_status: string;
  currency: string;
  host: string;
  shop_active: boolean;
  shop_inactive_message: string;
  entry_submit_message: string;
  payment_redirect: string;
  register: string;
  approach_transaction_expiration: string;
}

export default function SystemConfigs() {
  const WebAppConfigData = useFetch({ requestQuery: '/config/system' });
  const ConfigData =
    (WebAppConfigData.data as { data: WebAppConfigProps }).data || null;

  const onSubmit = (data) => {
    console.log(data);
  };

  return WebAppConfigData.isLoading ? (
    <Loading />
  ) : WebAppConfigData.error ? (
    <></>
  ) : (
    WebAppConfigData.data && (
      <div>
        <SimpleForm defaultValues={ConfigData}>
          <TextInput
            source="app_name"
            // defaultValue={(WebAppConfigData.data as WebAppConfigProps).app_name}
          />
          <TextInput source="consumer_status" />
          <TextInput source="currency" />
          <TextInput source="host" />
          <BooleanInput source="shop_active" />
          <TextInput source="shop_inactive_message" />
          <TextInput source="entry_submit_message" />
          <TextInput source="payment_redirect" />
          <TextInput source="register" />
          <TextInput source="approach_transaction_expiration" />
        </SimpleForm>
      </div>
    )
  );
}
