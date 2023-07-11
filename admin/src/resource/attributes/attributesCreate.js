import { ArrayInput, Create, SelectInput, SimpleFormIterator, TextInput, useTranslate } from "react-admin";
import { Divider } from "@mui/material";
import { List, SimpleForm, UploaderField } from "@/components";
import useStyles from "@/styles";
import { Val } from "@/Utils";
import Form  from "./attributesForm";

const defaultValues = {
  values: [
    {
      name: {
        fa: ""
      },
      slug: ""
    }
  ]
};


const create = (props) => (
  <Create {...props}>
    <Form/>
  </Create>
);

export default create;
