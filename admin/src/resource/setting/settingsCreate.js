import {
  ArrayInput,
  BooleanField,
  BooleanInput,
  Create,
  Datagrid,
  DeleteButton,
  Edit,
  EditButton,
  SelectArrayInput,
  SelectInput,
  SimpleFormIterator,
  TextInput,
  NumberInput,
  useTranslate
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

function thel(values) {
  // console.log('change photos field', values);

  valuess["photos"] = values;
  // console.log(values);

}

function thelF(values) {
  // console.log('change files field', values);

  valuess["files"].push({
    url: values
  });
  // console.log(values);

}


const list = (props) => {
  const translate=useTranslate();


  return(
    <List {...props}>
      <Datagrid optimized>
        siteActive
        <BooleanField source="siteActive" label={translate("resources.settings.siteStatus")}/>

        {/*<TextField source="data" label="data" sortable={false}/>*/}
        {/*<CustomTextInput source="description.fa" label="description" sortable={false}/>*/}
        {/*<TextField source="data" label="data" sortable={false}/>*/}
        {/*<TextField source="secondCategory.name.fa" label="second Category" sortable={false}/>*/}
        {/*<TextField source="thirdCategory.name.fa" label="third Category" sortable={false}/>*/}
        {/*<NumberField source="price" label="Price" sortable={false}/>*/}
        {/*<NumberField source="salePrice" label="sale price" sortable={false}/>*/}
        {/*<FileChips source="photos" sortable={false}/>*/}
        <EditButton/>
        <DeleteButton/>
      </Datagrid>
    </List>
  );
}

const Form = ({ children, ...props }) => {
  // console.log('vprops', props);
  const cls = useStyles();
  const translate=useTranslate();
  const notify=useNotify();
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
      <BooleanInput source="siteActive" label="site status"/>
      <BooleanInput source="tax" label={translate("resources.settings.tax")}/>
      <NumberInput source="taxAmount" label={translate("resources.settings.taxAmount")}/>

      {/*<ReferenceArrayInput label="دسته های فعال" source="category" reference="category" filter={{f:true}} >*/}
      {/*<SelectArrayInput optionText="name" optionValue="_id">*/}
      {/*/!*<ChipField source="name" />*!/*/}
      {/*</SelectArrayInput>*/}
      {/*</ReferenceArrayInput>*/}
      {/*<SelectArrayInput label={"دسته های فعال"} source="activeCategory" optionValue="_id" choices={[{*/}
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
      {/*<AutocompleteInput  optionText="name.fa"  optionValue="_id" />*/}

      {/*<AutocompleteInput source="category" optionText="name.fa"  optionValue="_id" />*/}
      <TextInput
        fullWidth
        source={"siteActiveMessage"}
        label="site message when is deactive"
      />
      <ArrayInput source="data">
        <SimpleFormIterator {...props}>
          {/*<SelectInput*/}
          {/*label="Option Type"*/}
          {/*source="optionType"*/}
          {/*choices={typeChoices}*/}
          {/*formClassName={cls.f2}*/}
          {/*/>*/}
          {/*<BooleanInput*/}
          {/*source="isResponse"*/}
          {/*label="is Response"*/}
          {/*formClassName={cls.f2}*/}
          {/*/>*/}
          <TextInput
            fullWidth
            source={"title"}
            label="Title"
            // record={scopedFormData}
          /> <TextInput
          fullWidth
          source={"theid"}
          label="theid"
          // record={scopedFormData}
        />
          <TextInput
            fullWidth
            source={"description"}
            label="description"
            // record={scopedFormData}
          />


          <SelectInput
            label="شهر"
            fullWidth
            className={"mb-20"}
            source="city"
            choices={typeChoices}

          />

          <SelectInput
            label="هست/نیست"
            fullWidth
            className={"mb-20"}
            source="is"
            choices={typeChoices3}

          />
          <TextInput

            source={"priceLessThanCondition"}
            label="قیمت کمتر از شرط"
            // record={scopedFormData}
          />
          <TextInput

            source={"condition"}
            label="شرط"
            // record={scopedFormData}
          />
          <TextInput

            source={"priceMoreThanCondition"}
            label="قیمت بیشتر از شرط"
            // record={scopedFormData}
          />
          {/*<FormDataConsumer>*/}
          {/*{({ getSource, scopedFormData }) =>*/}

          {/*( <TextInput*/}
          {/*fullWidth*/}
          {/*source={getSource('title')}*/}
          {/*label="Title"*/}
          {/*record={scopedFormData}*/}
          {/*/>*/}
          {/*)*/}
          {/*}*/}
          {/*</FormDataConsumer>*/}
        </SimpleFormIterator>
      </ArrayInput>


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

const create = (props) => (
  <Create {...props}>
    <Form>

    </Form>
  </Create>
);

export default create;
