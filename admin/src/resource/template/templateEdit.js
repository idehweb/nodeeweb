import { Edit, useForm, useTranslate } from 'react-admin';

import React from 'react';

import { useEditController, TextInput } from 'react-admin';

import { BASE_URL } from '@/functions/API';
import { dateFormat } from '@/functions';
import {
  CatRefField,
  EditOptions,
  FileChips,
  List,
  ShowDescription,
  showFiles,
  ShowLink,
  ShowOptions,
  ShowPictures,
  SimpleForm,
  SimpleImageField,
  UploaderField,
} from '@/components';
import { Val } from '@/Utils';

import Form from './templateForm';


export const templateEdit = (props) => {
  console.log('props', props);
  const translate = useTranslate();
  const { id } = props;
  const { record, save, isLoading } = useEditController({
    resource: 'template',
    id,
  });

  return (
    <Edit {...props} redirect={false} mutationMode={'pessimistic'}>
      <Form record={record} redirect={false}>
        <TextInput
          source={'_id'}
          label={translate('_id')}
          className={'width100 mb-20'}
          fullWidth
          disabled
        />
      </Form>
    </Edit>
  );
};

export default templateEdit;