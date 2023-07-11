import { Create, ReferenceInput, SaveButton, SelectInput, TextInput, Toolbar, useTranslate } from "react-admin";
import React from "react";
import { CustomResetViewsButton, List, SimpleForm } from "@/components";
import useStyles from "@/styles";
import { Val } from "@/Utils";
import API, { BASE_URL } from "@/functions/API";

var theID = null;
const transformUser = data => ({
  ...data,
  parent: {}
});
const PostEditToolbar = () => (
  <Toolbar>
    <SaveButton onSubmit={(e) => {
      save(e);
    }}/>
  </Toolbar>
);

const Form = ({ children, ...rest }) => {
  const cls = useStyles();
  const translate = useTranslate();
  // {...rest}
  return (
    <SimpleForm toolbar={<PostEditToolbar/>} onSubmit={v => save(v)}>
      {children}
      <TextInput
        source={"name." + translate("lan")}
        label={translate("resources.category.name")}
        validate={Val.req}
        formClassName={cls.f2}
        fullWidth
      />
      <TextInput
        source="slug"
        label={translate("resources.category.slug")}
        validate={Val.req}
        formClassName={cls.f2}
        fullWidth
      />
      <ReferenceInput
        label={translate("resources.category.parent")}
        source="parent"
        reference="customerGroup"
        defaultValue={{}}
        perPage={1000}
        formClassName={cls.f2}>
        <SelectInput optionText={"name." + translate("lan")} optionValue="id"/>
      </ReferenceInput>
      {/*<NumberInput*/}
      {/*source="order"*/}
      {/*label={translate('resources.category.order')}*/}
      {/*fullWidth*/}
      {/*/>*/}
    </SimpleForm>
  );
};

function save(record) {
  console.log("save", record, theID);

  // if (record.plusx) {
  let type = null, number = 0;
  if (record.parent=="") {
    delete record.parent;
  //     type = 'plusx';
  //     number = record.plusx;
  }

  API.post("/customerGroup/", JSON.stringify(record))
    .then(({ data = {} }) => {
      // const refresh = useRefresh();
      // refresh();
      // alert("it is ok");
      // window.location.reload();
      // if (data.success) {
      //     values = [];
      //     valuess = [];
      // }
    })
    .catch((err) => {
      console.log("error", err);
    });

  // }

  // return 0;
}


const create = (props) => (
  <Create {...props}>
    <Form/>
  </Create>
);

export default create;
