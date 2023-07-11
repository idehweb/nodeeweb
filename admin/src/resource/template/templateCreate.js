import {
  Create,
  DeleteButton,
  SaveButton,
  SelectInput,
  TextInput,
  Toolbar,
  useForm,
  useRecordContext,
  useTranslate
} from "react-admin";
import API, { BASE_URL } from "@/functions/API";
import { dateFormat } from "@/functions";
import _ from "lodash";
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
  UploaderField

} from "@/components";
import { makeStyles } from "@mui/styles";
import { Val } from "@/Utils";
import Form from "./templateForm";

import React from "react";


const create = (props) => (
  <Create {...props}>
    <Form>


    </Form>
  </Create>
);

export default create;
