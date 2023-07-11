import {
  BooleanInput,
  Create,
  ReferenceArrayInput,
  SelectArrayInput,
  SelectInput,
  TextInput,
  useTranslate
} from "react-admin";
import { dateFormat } from "@/functions";
import { List, ReactAdminJalaliDateInput, SimpleForm } from "@/components";


export const customerCreate = (props) => {
  const translate = useTranslate();

  return (
    <Create {...props}>
      <SimpleForm> <TextInput
        fullWidth
        disabled source="id" label={translate("resources.customers._id")}/>
        <TextInput
          fullWidth
          source="firstName" label={translate("resources.customers.firstName")}/>
        <TextInput fullWidth
                   source="lastName" label={translate("resources.customers.lastName")}/>
        <TextInput fullWidth
                   source="internationalCode" label={translate("resources.customers.internationalCode")}/>
        <TextInput fullWidth
                   source="email" type="email" label={translate("resources.customers.email")}/>
        <TextInput fullWidth
                   source="companyName" type="text" label={translate("resources.customers.companyName")}/>
        <TextInput fullWidth
                   source="companyTelNumber" type="text" label={translate("resources.customers.companyTelNumber")}/>
        <TextInput fullWidth
                   source="phoneNumber" label={translate("resources.customers.phoneNumber")}/>
        <TextInput fullWidth
                   source="countryCode" label={translate("resources.customers.countryCode")}/>
        <TextInput fullWidth
                   source="activationCode" label={translate("resources.customers.activationCode")}/>

        <TextInput fullWidth
                   source="birthday" label={translate("resources.customers.birthday")}/>
        <TextInput defaultValue={"{}"} multiline  fullWidth
                   source="data" label={translate("resources.customers.data")}/>
        <ReactAdminJalaliDateInput
          fullWidth
          source="birthdate" label={translate("resources.customers.birthdate")}/>
        <SelectInput
          fullWidth
          label={translate("resources.customers.sex")}
          defaultValue={""}
          source="sex"
          choices={[
            { id: "", name: "" },
            { id: "male", name: translate("resources.customers.male") },
            { id: "female", name: translate("resources.customers.female") }
          ]}
        />
        <SelectInput
          label={translate("resources.customers.source")}
          defaultValue={"CRM"}
          fullWidth
          source="source"
          choices={[

            { id: "WEBSITE", name: translate("resources.customers.WEBSITE") },
            { id: "CRM", name: translate("resources.customers.CRM") }
          ]}
        />
        <TextInput fullWidth
                   source="source"
                   defaultValue={"CRM"}
                   label={translate("resources.customers.source")}/>
        <ReferenceArrayInput source="customerGroup" reference="customerGroup">
          <SelectArrayInput
            fullWidth
            label={translate("resources.customers.customerGroup")}
            optionText="name.fa"/>
        </ReferenceArrayInput>
        <BooleanInput
          fullWidth

          source="active" label={translate("resources.customers.active")}/>

      </SimpleForm>
    </Create>
  );
};


export default customerCreate;
