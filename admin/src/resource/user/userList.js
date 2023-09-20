import {
  BooleanField,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  EditButton,
  useTranslate,
  Pagination,
  downloadCSV,
} from 'react-admin';

import jsonExport from 'jsonexport/dist';

import { List, SimpleForm } from '@/components';

const PostPagination = (props) => (
  <Pagination rowsPerPageOptions={[10, 25, 50, 100]} {...props} />
);
const exporter = (users) => {
  let allpros = [];
  const userForExport = users.map((user) => {
    const { backlinks, author, ...userForExport } = user; // omit backlinks and author
    if (user) {
      allpros.push({
        _id: user._id,
        firstName: user.firstName && user.firstName,
        lastName: user.lastName && user.lastName,
        username: user.username && user.username,
        type: user.type && user.type,
        email: user.email && user.email,
        active: user.active && user.active,
        createdAt: user.createdAt && user.createdAt,
        updatedAt: user.updatedAt && user.updatedAt,
      });
    }
    return userForExport;
  });
  jsonExport(
    allpros,
    {
      headers: [
        '_id',
        'firstName',
        'lastName',
        'username',
        'type',
        'email',
        'active',
        'createdAt',
        'updatedAt',
      ], // user fields in the export
    },
    (err, csv) => {
      const BOM = '\uFEFF';
      downloadCSV(`${BOM} ${csv}`, 'users'); // download as 'posts.csv` file
    }
  );
};
export const userList = (props) => {
  const translate = useTranslate();
  return (
    <List {...props} exporter={exporter} pagination={<PostPagination />}>
      <Datagrid>
        {/*<TextField source="id"/>*/}
        <EmailField source="email" label={translate('resources.user.email')} />
        <TextField
          source="username"
          label={translate('resources.user.username')}
        />
        <TextField
          source="firstName"
          label={translate('resources.user.firstName')}
        />
        <TextField
          source="lastName"
          label={translate('resources.user.lastName')}
        />
        <DateField
          source="createdAt"
          showTime
          label={translate('resources.user.createdAt')}
        />
        <DateField
          source="updatedAt"
          showTime
          label={translate('resources.user.updatedAt')}
        />
        <BooleanField
          source="active"
          label={translate('resources.user.active')}
        />
        <EditButton />
      </Datagrid>
    </List>
  );
};

export default userList;
