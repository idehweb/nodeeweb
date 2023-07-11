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

export const userCreate = (props) => {
  const translate=useTranslate();

  return(
    <Create {...props}>
      <SimpleForm>
        <TextInput disabled source="id" label={translate("resources.user._id")} />
        <TextInput source="nickname" label={translate("resources.user.nickname")} />
        <TextInput source="email" type="email" label={translate("resources.user.email")} />
        <TextInput source="username" label={translate("resources.user.username")} />
        <PasswordInput source="password" label={translate("resources.user.password")} />
        <BooleanInput source="active" label={translate("resources.user.active")} />
      </SimpleForm>
    </Create>
  );
}
export default userCreate;
