import { Create, required,TextInput,useTranslate,ReferenceInput ,AutocompleteInput} from "react-admin";

import { CustomFileField, GridList, List, SimpleForm, UploaderField } from "@/components";

import { RichTextInput } from "ra-input-rich-text";
import { Val } from "@/Utils";

const create = (props) => {
  const translate = useTranslate();
  const transform = data => ({
    ...data,
    customer: (data.customer) ? data.customer : null
  });
  return(
    <Create {...props} transform={transform}>
      <SimpleForm>

        <TextInput source={"title." + translate("lan")} label={translate("resources.product.title")}
                   className={"width100 mb-20"} validate={Val.req} fullWidth/>
        <RichTextInput multiline fullWidth source={"description." + translate("lan")}
                       label={translate("resources.product.description")}/>

        <ReferenceInput
          fullWidth
          allowEmpty
          source="customer"
          reference="customer">
          <AutocompleteInput
            fullWidth
            allowEmpty
            label={translate("resources.order.customer")}
            optionText={"phoneNumber"}
            optionValue={"_id"}
          />
        </ReferenceInput>
        {/*<UploaderField*/}
        {/*label="Course Audio or video"*/}
        {/*source="files"*/}
        {/*accept="audio/*, video/*, image/*"*/}
        {/*validate={required()}*/}
        {/*/>*/}
      </SimpleForm>
    </Create>
  );
}

export default create;
