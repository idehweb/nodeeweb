import {
  ArrayInput,
  Edit,
  SelectInput,
  SimpleFormIterator,
  TextInput,
  useTranslate,
  FormDataConsumer,
} from 'react-admin';
import { Divider } from '@mui/material';

import { AttrType, List, SimpleForm, UploaderField } from '@/components';
import useStyles from '@/styles';
import { Val } from '@/Utils';

import { ColorPicker } from '@/components';

import Form from './attributesForm';

const defaultValues = {
  values: [
    {
      name: {
        fa: '',
      },
      slug: '',
    },
  ],
};

const edit = (props) => (
  <Edit {...props} redirect={false} mutationMode={'pessimistic'}>
    <Form />
  </Edit>
);

export default edit;
