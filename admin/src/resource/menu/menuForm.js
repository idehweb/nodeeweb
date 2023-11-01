import {
  DeleteButton,
  SaveButton,
  SelectInput,
  TextInput,
  ReferenceInput,
  Toolbar,
  NumberInput,
  useNotify,
  useRedirect,
  useTranslate,
} from 'react-admin';
import { useFormContext } from 'react-hook-form';

import React from 'react';

import API from '@/functions/API';
import { dateFormat } from '@/functions';
import {
  CatRefField,
  Combinations,
  EditOptions,
  FileChips,
  FormTabs,
  List,
  ProductType,
  ShowDescription,
  ShowLink,
  ShowOptions,
  ShowPictures,
  SimpleForm,
  SimpleImageField,
  UploaderField,
} from '@/components';
import { Val } from '@/Utils';

const Form = ({ children, ...props }) => {
  // console.log("vprops", props);
  // const record = useRecordContext();
  // if (!record) return null;
  const translate = useTranslate();
  // const notify = useNotify();
  // const {reset} = useFormContext();

  const save = (e) => {
    e.preventDefault();
    console.log('hi');
  };
  // console.log("record", record);
  // valuess['photos'] = props.record.photos || [];
  // if(valuess['options']!=record.options){
  //   record.options=valuess['options'];
  // }
  // console.log('productForm...',record);
  const totals = 0;
  // toolbar={<CustomToolbar/>}
  console.log('props', props);
  return (
    <SimpleForm {...props}>
      {children}
      <TextInput
        source={'name.' + translate('lan')}
        label={translate('resources.menu.name')}
        validate={Val.req}
        fullWidth
      />
      <TextInput
        source="slug"
        label={translate('resources.menu.slug')}
        validate={Val.req}
        fullWidth
      />
      <ReferenceInput
        label={translate('resources.menu.parent')}
        source="parent"
        reference="menu"
        perPage={1000}>
        <SelectInput optionText={'name.' + translate('lan')} optionValue="id" />
      </ReferenceInput>

      <TextInput
        source="link"
        label={translate('resources.menu.link')}
        fullWidth
      />
      <NumberInput
        source="order"
        label={translate('resources.menu.order')}
        fullWidth
      />
    </SimpleForm>
  );
};

export default Form;
