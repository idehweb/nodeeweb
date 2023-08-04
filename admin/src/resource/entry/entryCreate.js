import {
  Create,
  DeleteButton,
  SaveButton,
  SelectInput,
  TextInput,
  Toolbar,
  useRecordContext,
  useTranslate,
} from 'react-admin';

import { makeStyles } from '@mui/styles';

import React from 'react';

import API, { BASE_URL } from '@/functions/API';
import { dateFormat } from '@/functions';
import {
  CatRefField,
  EditOptions,
  FileChips,
  List,
  ShowDescription,
  ShowLink,
  ShowOptions,
  ShowPictures,
  SimpleForm,
  SimpleImageField,
  UploaderField,
} from '@/components';
import { Val } from '@/Utils';

import Form from './entryForm';


const create = (props) => (
  <Create {...props}>
    <Form></Form>
  </Create>
);

export default create;
