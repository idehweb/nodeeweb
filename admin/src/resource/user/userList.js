import {
  BooleanField,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  EditButton,
  useTranslate,
  Pagination,
    FunctionField,
  downloadCSV,
} from 'react-admin';
import {dateFormat} from '@/functions';

import {useMediaQuery} from '@mui/material';

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
    const isSmall = useMediaQuery(
        theme => theme.breakpoints.down('768'),
        {noSsr: true}
    );
  return (
    <List {...props} exporter={exporter} pagination={<PostPagination />}>
        {isSmall ? (
            <Datagrid
                optimized
                bulkActionButtons={false}
                // rowStyle={postRowStyle}
            >

                <FunctionField
                    label={translate('resources.user.actions')}
                    render={(record) => (
                        <>
                          <div>
                              <EmailField source="email" label={translate('resources.user.email')} />
                          </div>
                        <div>
                            <span>{translate('resources.user.username')}:</span><TextField
                                  source="username"
                                  label={translate('resources.user.username')}
                              />
                        </div>
                        <div>
                            <span>{translate('resources.user.firstName')}:</span><TextField
                                  source="firstName"
                                  label={translate('resources.user.firstName')}
                              />
                        </div>
                        <div>
                            <span>{translate('resources.user.lastName')}:</span><TextField
                                  source="lastName"
                                  label={translate('resources.user.lastName')}
                              />
                        </div>
                        <div className="theDate">
                            <div>
                                {translate('resources.page.createdAt') +
                                ': ' +
                                `${dateFormat(record.createdAt)}`}
                            </div>
                            <div>
                                {translate('resources.page.updatedAt') +
                                ': ' +
                                `${dateFormat(record.updatedAt)}`}
                            </div>

                        </div>
                        <div>
                              <BooleanField
                                  source="active"
                                  label={translate('resources.user.active')}
                              />
                        </div>
                        <div>
                              <EditButton />
                          </div>
                        </>
                    )}/>
            </Datagrid>) :
            (<Datagrid>
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
                <FunctionField
                    label="resources.user.date"
                    render={(record) => {
                        return (
                            <div className="theDate">
                                <div>
                                    {translate('resources.user.createdAt')}:
                                    <span dir="ltr"> {dateFormat(record.createdAt)}</span>
                                </div>
                                <div>
                                    {translate('resources.user.updatedAt')}:
                                    <span dir="ltr"> {dateFormat(record.updatedAt)}</span>
                                </div>

                            </div>
                        );
                    }}
                />

              <BooleanField
          source="active"
          label={translate('resources.user.active')}
        />
        <EditButton />
      </Datagrid>)}
    </List>
  );
};

export default userList;
