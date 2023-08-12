import {
  AutocompleteInput,
  TextInput,
  SelectInput,
  Create,
  NumberInput,
  ReferenceInput,
  useTranslate,
} from 'react-admin';

import React, { useState } from 'react';

import {
  AddProductsField,
  List,
  OrderPaymentStatus,
  OrderStatus,
  PrintOrder,
  PrintPack,
  SimpleForm,
} from '@/components';
import { dateFormat } from '@/functions';

import API, { BASE_URL } from '@/functions/API';
// import { useTranslate } from "react-admin";

const Form = ({ children, ...props }) => {
  const translate = useTranslate();
  const [url, setUrl] = useState(['']);

  return (
    <SimpleForm
      fullWidth
      {...props}
      // onSubmit={(e) => save(e)}
      className={'d-flex0'}>
      <AddProductsField source="card" url={'/product/0/1000'} />

      <ReferenceInput fullWidth source="customer" reference="customer">
        <AutocompleteInput
          fullWidth
          label={translate('resources.order.customer')}
          optionText={'phoneNumber'}
          optionValue={'_id'}
        />
      </ReferenceInput>
      <SelectInput
        label={translate('resources.order.paymentStatus')}
        fullWidth
        className={'mb-20'}
        source="paymentStatus"
        defaultValue="notpaid"
        optionValue="id"
        optionText="name"
        choices={OrderPaymentStatus()}
        translateChoice={true}
      />
      <SelectInput
        label={translate('resources.order.status')}
        fullWidth
        defaultValue="processing"
        className={'mb-20'}
        source="status"
        choices={OrderStatus()}
      />

      {/*<NumberInput source="sum" label={translate("resources.order.sum")}*/}
      {/*className={"width100 mb-20 ltr"} fullWidth/>*/}

      {/*<NumberInput source="amount" label={translate("resources.order.amount")}*/}
      {/*className={"width100 mb-20 ltr"} fullWidth/>*/}

      <TextInput
        fullWidth
        // record={scopedFormData}

        source={'sum'}
        className={'ltr'}
        label={translate('resources.order.sum')}
        format={(v) => {
          if (!v) return '';

          return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }}
        parse={(v) => {
          if (!v) return '';

          return v.toString().replace(/,/g, '');
        }}
      />
      <TextInput
        fullWidth
        // record={scopedFormData}

        source={'amount'}
        className={'ltr'}
        label={translate('resources.order.amount')}
        format={(v) => {
          if (!v) return '';

          return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }}
        parse={(v) => {
          if (!v) return '';

          return v.toString().replace(/,/g, '');
        }}
      />

      {children}
    </SimpleForm>
  );
};

const create = (props) => (
  <Create {...props}>
    <Form></Form>
  </Create>
);

export default create;
