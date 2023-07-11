import { Create, ReferenceInput, SelectInput, TextInput, useTranslate,useRedirect } from "react-admin";
import React from "react";
import { CustomResetViewsButton, List, SimpleForm } from "@/components";
import useStyles from "@/styles";
import { Val } from "@/Utils";
import { BASE_URL } from "@/functions/API";
import API from "@/functions/API";

var theID = null;


const Form = ({ children, ...rest }) => {
  const cls = useStyles();
  const translate = useTranslate();
  const redirect = useRedirect();

  function save(values) {
    if (values.parent == "") {
      delete values.parent;
    }
    API.post("/productCategory/", JSON.stringify({ ...values }))
      .then(({ data = {} }) => {
        // showNotification(translate('product.created'));
        // console.clear()
        console.log("data", data);
        if (data._id) {
          redirect('/productCategory/'+data._id);

          // window.location.href = "/#/productCategory/" + data._id;
          // window.location.reload();
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  }

  return (
    <SimpleForm {...rest}
                onSubmit={v => save(v)}

    >
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

        reference="productCategory"
        perPage={1000}
        allowEmpty
        formClassName={cls.f2}>
        <SelectInput optionText={"name." + translate("lan")} optionValue="id"/>
      </ReferenceInput>

    </SimpleForm>
  );
};



const create = (props) => (
  <Create {...props}>
    <Form/>
  </Create>
);

export default create;
