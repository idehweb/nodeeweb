import {
  BooleanField,
  Edit,
  Create,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  EditButton,
  DeleteButton,
  TextInput,
  PasswordInput,
  BooleanInput,
  useTranslate
} from 'react-admin';
import { List, SimpleForm } from '@/components';


export const userEdit = (props) => {
  const translate=useTranslate();

  return(
    <Edit {...props}>
      <SimpleForm>
        <TextInput disabled fullWidth source="id" label={translate("resources.user._id")} />
        <TextInput fullWidth source="nickname" label={translate("resources.user.nickname")} />
        <TextInput fullWidth source="email" type="email" label={translate("resources.user.email")} />
        <TextInput fullWidth source="username" label={translate("resources.user.username")} />
        <PasswordInput fullWidth source="password" label={translate("resources.user.password")} />
        <BooleanInput fullWidth source="active" label={translate("resources.user.active")} />
      </SimpleForm>
    </Edit>
  );
}

export default userEdit;
