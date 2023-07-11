import {
  ArrayInput,
  BooleanInput,
  Edit,
  SelectArrayInput,
  ReferenceInput,
  SelectInput,
  SimpleFormIterator,
  TextInput,
  useTranslate,
  NumberInput
} from "react-admin";
import { CatRefField, DeliverySchedule, FileChips, List, showFiles, SimpleForm } from "@/components";
import API from "@/functions/API";
import { SettingsApplications as Icon } from "@mui/icons-material";
import { Val } from "@/Utils";
import useStyles from "@/styles";
import { useNotify } from "react-admin";

const typeChoices3 = [
  {
    id: "is",
    name: "هست"
  },
  {
    id: "isnt",
    name: "نیست"
  }
];

const typeChoices = [
  {
    id: "تهران",
    name: "تهران"
  },
  {
    id: "شهرستان",
    name: "شهرستان"
  }
];

var valuess = {};

function returnToHome(values) {
  console.log("returnToHome", values);

}



const Form = ({ children, ...props }) => {
  const translate = useTranslate();
  const notify = useNotify();
  function save(values) {
    // console.log('product values', values);
    // console.log('product valuess', valuess);
    // console.log('last values: ', values);
    if (values._id) {
      API.put("/settings/" + values._id, JSON.stringify({ ...values }))
        .then(({ data = {} }) => {
          notify(translate("saved successfully."), {
            type: "success"
          });
          if (data.success) {
            values = [];
            valuess = [];
          }
        })
        .catch((err) => {
          console.log("error", err);
        });
    } else {

      API.post("/settings/", JSON.stringify({ ...values }))
        .then(({ data = {} }) => {
          notify(translate("saved successfully."), {
            type: "success"
          });

          if (data.success) {
            values = [];
            valuess = [];
          }
        })
        .catch((err) => {
          console.log("error", err);
        });
    }
  }

  return (
    <SimpleForm {...props} onSubmit={save}>
      <BooleanInput source="siteActive" label={translate("resources.settings.siteActive")}/>
      <BooleanInput source="tax" label={translate("resources.settings.tax")}/>
      <NumberInput source="taxAmount" label={translate("resources.settings.taxAmount")}/>

      {/*<SelectArrayInput label={translate("resources.settings.activeCategory")} source="activeCategory" optionValue="_id" choices={[{*/}
        {/*"_id": "61d58e37d931414fd78c7fb7",*/}
        {/*"name": "تبلت",*/}
        {/*"slug": "tablets"*/}
      {/*}, {*/}
        {/*"_id": "61d58e37d931414fd78c7fb8",*/}
        {/*"name": "رایانه‌های رومیزی",*/}
        {/*"slug": "all-in-one"*/}
      {/*}, {*/}
        {/*"_id": "61d58e37d931414fd78c7fb9",*/}
        {/*"name": "ساعت و مچ‌بند هوشمند",*/}
        {/*"slug": "smart-watch"*/}
      {/*}, {*/}
        {/*"_id": "61d58e37d931414fd78c7fba",*/}
        {/*"name": "لوازم جانبی",*/}
        {/*"slug": "accessories"*/}
      {/*}, {*/}
        {/*"_id": "61d58e37d931414fd78c7fbb",*/}
        {/*"name": "لپ تاپ",*/}
        {/*"slug": "laptop"*/}
      {/*}, {*/}
        {/*"_id": "61d58e37d931414fd78c7fbc",*/}
        {/*"name": "کنسول های بازی",*/}
        {/*"slug": "gaming-console"*/}
      {/*}, {*/}
        {/*"_id": "61d58e37d931414fd78c7fbd",*/}
        {/*"name": "گوشی هوشمند",*/}
        {/*"slug": "smart-phones"*/}
      {/*}, { "_id": "622d964f8312bb1f3b5f8725", "name": "گیفت کارت", "slug": "gift-card" }]}/>*/}


      <TextInput
        fullWidth
        source={"siteActiveMessage"}
        label={translate("resources.settings.siteActiveMessage")}
      />
      <ArrayInput source="data">
        <SimpleFormIterator {...props}>
          <TextInput
            fullWidth
            source={"title"}
            label={translate("resources.settings.title")}
          />
          <TextInput
          fullWidth
          source={"theid"}
          label={translate("resources.settings.theid")}
        />
          <TextInput
            fullWidth
            source={"description"}
            label={translate("resources.settings.description")}
          />


          <SelectInput
            label={translate("resources.settings.city")}
            fullWidth
            className={"mb-20"}
            source="city"
            choices={typeChoices}

          />

          <SelectInput
            label={translate("resources.settings.is_isnt")}
            fullWidth
            className={"mb-20"}
            source="is"
            choices={typeChoices3}

          />
          <TextInput

            source={"priceLessThanCondition"}
            label={translate("resources.settings.priceLessThanCondition")}
          />
          <TextInput

            source={"condition"}
            label={translate("resources.settings.condition")}
          />
          <TextInput

            source={"priceMoreThanCondition"}
            label={translate("resources.settings.priceMoreThanCondition")}
          />
        </SimpleFormIterator>
      </ArrayInput>
      <ArrayInput source="customerStatus">
        <SimpleFormIterator {...props}>
          <TextInput
            fullWidth
            source={"title"}
            label={translate("resources.settings.title")}
          />
          <TextInput
            fullWidth
            source={"slug"}
            label={translate("resources.settings.slug")}
          />

        </SimpleFormIterator>
      </ArrayInput>
      <ArrayInput source="formStatus">
        <SimpleFormIterator {...props}>
          <TextInput
            fullWidth
            source={"title"}
            label={translate("resources.settings.title")}
          />
          <TextInput
            fullWidth
            source={"slug"}
            label={translate("resources.settings.slug")}
          />

        </SimpleFormIterator>
      </ArrayInput>

      <TextInput fullWidth source={"title."+ translate("lan")} label={translate('resources.settings.title')} />
      <TextInput fullWidth source={"description."+ translate("lan")} label={translate('resources.settings.description')} />
      <TextInput fullWidth source="currency" label={translate('resources.settings.currency')} />
      <TextInput multiline fullWidth source="sms_welcome" label={translate('resources.settings.welcome')} />
      <TextInput multiline fullWidth source="sms_register" label={translate('resources.settings.register')} />
      <TextInput multiline fullWidth source="sms_submitOrderNotPaying" label={translate('resources.settings.submitOrderNotPaying')} />
      <TextInput multiline fullWidth source="sms_submitOrderSuccessPaying" label={translate('resources.settings.submitOrderSuccessPaying')} />
      {/*<TextInput multiline fullWidth source="sms_status_link" label={translate('product.description')} />*/}
      <TextInput multiline fullWidth source="sms_onSendProduct" label={translate('resources.settings.onSendProduct')} />
      <TextInput multiline fullWidth source="sms_onGetProductByCustomer" label={translate('resources.settings.onGetProductByCustomer')} />
      <TextInput multiline fullWidth source="sms_submitReview" label={translate('resources.settings.submitReview')} />
      <TextInput multiline fullWidth source="sms_onCancel" label={translate('resources.settings.onCancel')} />
      <TextInput multiline fullWidth source="factore_shop_name" label={translate('resources.settings.shop_name')} />
      <TextInput multiline fullWidth source="factore_shop_site_address" label={translate('resources.settings.shop_site_address')} />
      <TextInput multiline fullWidth source="factore_shop_address" label={translate('resources.settings.shop_address')} />
      <TextInput multiline fullWidth source="factore_shop_phoneNumber" label={translate('resources.settings.shop_phoneNumber')} />
      <TextInput multiline fullWidth source="factore_shop_faxNumber" label={translate('resources.settings.shop_faxNumber')} />
      <TextInput multiline fullWidth source="factore_shop_postalCode" label={translate('resources.settings.shop_postalCode')} />
      <TextInput multiline fullWidth source="factore_shop_submitCode" label={translate('resources.settings.shop_submitCode')} />
      <TextInput multiline fullWidth source="factore_shop_internationalCode" label={translate('resources.settings.shop_internationalCode')} />
      {/*defaultSmsGateway*/}
      <ReferenceInput
        label={translate('resources.settings.defaultSmsGateway')}
        source="defaultSmsGateway"
        reference="gateway"
        perPage={1000}
        allowEmpty
      >
        <SelectInput optionText={"title."+translate('lan')} optionValue="id"/>
      </ReferenceInput>
      {children}
    </SimpleForm>
  );
};

const edit = (props) => (
  <Edit {...props}>
    <Form>

    </Form>
  </Edit>
);


export default edit;
