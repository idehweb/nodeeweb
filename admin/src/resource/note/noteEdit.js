import { Edit, required,TextInput,useTranslate } from "react-admin";

import { CustomFileField, GridList, List, SimpleForm, UploaderField } from "@/components";

import { RichTextInput } from "ra-input-rich-text";
import { Val } from "@/Utils";

const edit = (props) => {
  const translate = useTranslate();

  return(
    <Edit {...props}>
      <SimpleForm>

        <TextInput source={"title." + translate("lan")} label={translate("resources.product.title")}
                   className={"width100 mb-20"} validate={Val.req} fullWidth/>
        <RichTextInput multiline fullWidth source={"description." + translate("lan")}
                       label={translate("resources.product.description")}/>
        {/*<UploaderField*/}
        {/*label="Course Audio or video"*/}
        {/*source="files"*/}
        {/*accept="audio/*, video/*, image/*"*/}
        {/*validate={required()}*/}
        {/*/>*/}
      </SimpleForm>
    </Edit>
  );
}

export default edit;
