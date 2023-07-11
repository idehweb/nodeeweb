import { Create, required } from "react-admin";

import { CustomFileField, GridList, List, SimpleForm, FileUploaderField } from "@/components";


const create = (props) => (
  <Create {...props}>
    <SimpleForm>
      <FileUploaderField
        label="Course Audio or video"
        source="files"
        // accept="audio/*, video/*, image/*"
        validate={required()}
      />
    </SimpleForm>
  </Create>
);

export default create;
