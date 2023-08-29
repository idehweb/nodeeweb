import { Create, required, Toolbar, SaveButton } from 'react-admin';

import {
  CustomFileField,
  GridList,
  List,
  SimpleForm,
  UploaderField,
} from '@/components';

// const PostCreateToolbar = () => (
//   <Toolbar>
//     <SaveButton label="Save" onClick={() => alert('Saving...')} />
//   </Toolbar>
// );

const create = (props) => (
  <Create {...props}>
    <SimpleForm toolbar={null}>
      <UploaderField
        label="Course Audio or video"
        source="files"
        accept={['image/*', 'video/*', 'audio/*']}
        validate={required()}
      />
    </SimpleForm>
  </Create>
);

export default create;
