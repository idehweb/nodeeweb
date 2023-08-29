import {
  Create,
  Datagrid,
  DateField,
  DeleteButton,
  Edit,
  EditButton,
  ReferenceField,
  ReferenceInput,
  RefreshButton,
  SelectInput,
  ShowButton,
  TextField,
  TextInput,
  useTranslate,
} from 'react-admin';
import CardActions from '@mui/material/CardActions';
import { Textsms as Icon, Send } from '@mui/icons-material';
import Button from '@mui/material/Button';
import axios from 'axios';

import { List, SimpleForm } from '@/components';

const SmsEditActions = ({ basePath, data, resource }) => (
  <CardActions>
    <ShowButton record={data} />
    <RefreshButton />
  </CardActions>
);

export const notificationCreate = (props) => {
  const translate = useTranslate();

  return (
    <Create {...props}>
      <SimpleForm>
        {/* <ReferenceInput
          fullWidth
          source="customerGroup"
          reference="customerGroup">
          <SelectInput
            fullWidth
            label={translate('resources.notification.customerGroup')}
            optionText="name.fa"
          />
        </ReferenceInput> */}

        {/* <TextInput
          source="phoneNumber"
          label={translate('resources.notification.phoneNumber')}
          fullWidth
        />
        <TextInput
          source="limit"
          label={translate('resources.notification.limit')}
          fullWidth
        />
        <TextInput
          source="offset"
          label={translate('resources.notification.offset')}
          fullWidth
        />
        <div>{translate('resources.messages.help')}</div> */}
        <TextInput
          source="title"
          label={translate('resources.notification.title')}
          fullWidth
        />
        <TextInput
          multiline
          source="message"
          label={translate('resources.notification.message')}
          fullWidth
        />
        <SelectInput
          label={translate('resources.notification.source')}
          fullWidth
          source="source"
          choices={[
            { id: 'CRM', name: translate('resources.notification.CRM') },
            {
              id: 'WEBSITE',
              name: translate('resources.notification.WEBSITE'),
            },
          ]}
        />
      </SimpleForm>
    </Create>
  );
};

export default notificationCreate;
