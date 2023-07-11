import { Create, NumberInput,SelectArrayInput, TextInput, useTranslate,ReferenceArrayInput } from "react-admin";
import React from "react";
import { CustomResetViewsButton, List, ReactAdminJalaliDateInput, SimpleForm } from "@/components";
import useStyles from "@/styles";
import { Val } from "@/Utils";
import API, { BASE_URL } from "@/functions/API";

var theID = null;


const Form = ({ children, ...rest }) => {
  const cls = useStyles();
  const translate = useTranslate();

  return (
    <SimpleForm {...rest}>
      {children}
      <TextInput
        source={"name." + translate("lan")}
        label={translate("resources.discount.name")}
        validate={Val.req}
        formClassName={cls.f2}
        fullWidth
      />
      <TextInput
        source="slug"
        label={translate("resources.discount.slug")}
        validate={Val.req}
        formClassName={cls.f2}
        fullWidth
      />
      <NumberInput
        source="percent"
        label={translate("resources.discount.percent")}
        formClassName={cls.f2}
        fullWidth
      />
      <NumberInput
        source="price"
        label={translate("resources.discount.price")}
        formClassName={cls.f2}
        fullWidth
      />
      <NumberInput
        source="count"
        label={translate("resources.discount.count")}
        formClassName={cls.f2}
        fullWidth
      />
<NumberInput
        source="customerLimit"
        label={translate("resources.discount.customerLimit")}
        formClassName={cls.f2}
        fullWidth
      />

      <ReferenceArrayInput
        label={translate("resources.discount.excludeProductCategory")}
        source="excludeProductCategory" reference="productCategory">
        <SelectArrayInput optionText="name.fa"/>
      </ReferenceArrayInput>
      <ReferenceArrayInput
        label={translate("resources.discount.excludeProduct")}
        source="excludeProduct" reference="product">
        <SelectArrayInput optionText="name.fa"/>
      </ReferenceArrayInput>
      <div>{translate("resources.discount.expire")}</div>
      <ReactAdminJalaliDateInput
        fullWidth
        source="expire" label={translate("resources.discount.expire")}/>
      {/*<ReferenceInput*/}
      {/*label={translate('resources.discount.parent')}*/}
      {/*source="parent"*/}
      {/*reference="productCategory"*/}

      {/*perPage={1000}*/}
      {/*formClassName={cls.f2}>*/}
      {/*<SelectInput optionText={"name."+translate('lan')} optionValue="id"/>*/}
      {/*</ReferenceInput>*/}
      {/*<NumberInput*/}
      {/*source="order"*/}
      {/*label={translate('resources.discount.order')}*/}
      {/*fullWidth*/}
      {/*/>*/}
    </SimpleForm>
  );
};

function save(record) {
  console.log("save", record, theID);

  // if (record.plusx) {
  let type = null, number = 0;
  if (record.plusx) {
    type = "plusx";
    number = record.plusx;
  }
  if (record.minusx) {
    type = "minusx";
    number = record.minusx;

  }
  if (record.plusxp) {
    type = "plusxp";
    number = record.plusxp;

  }
  if (record.minusxp) {
    type = "minusxp";
    number = record.minusxp;

  }
  if (theID)
    API.put("/product/modifyPriceByCat/" + theID, JSON.stringify({ type: type, number: number }))
      .then(({ data = {} }) => {
        // const refresh = useRefresh();
        // refresh();
        alert("it is ok");
        window.location.reload();
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
