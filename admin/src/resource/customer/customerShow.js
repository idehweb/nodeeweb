import {
  ArrayField,
  Datagrid,
  Filter,
  FunctionField,
  Pagination,
  Show,
  SimpleShowLayout,
  TextField,
  TextInput,
  useTranslate,
} from 'react-admin';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import {
  List,
  Notifications,
  Orders,
  SimpleForm,
  Tasks,
  Transactions,
  Notes,
  Documents,
  CustomerStatus,
} from '@/components';
import { dateFormat } from '@/functions';

// import ListActions from "./../components/ListActions"
const PostFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
    <TextInput label="Title" source="title" defaultValue="Hello, World!" />
  </Filter>
);
// export const postFilter = props => (
//     <Filter {...props}>
//         <TextInput label="Search" source="q" alwaysOn />
//         <BooleanInput source="is_published" alwaysOn />
//         <TextInput source="title" defaultValue="Hello, World!" />
//     </Filter>
// );
/*<BooleanInput source="is_published" alwaysOn />*/
/*<TextInput source="title" defaultValue="Hello, World!" />*/
const PostPagination = (props) => (
  <Pagination rowsPerPageOptions={[10, 25, 50, 100]} {...props} />
);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export const customerShow = (props) => {
  let translate = useTranslate();
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <Grid container spacing={2}>
          <Grid item lg={9} md={8} xs={12}>
            <Box sx={{ flexGrow: 1 }} style={{ marginBottom: '20px' }}>
              <Grid container spacing={2}>
                <Grid item lg={6} md={6} xs={6}>
                  <Item>
                    {translate('resources.customers.updatedAt') + ': '}{' '}
                    <FunctionField
                      label={translate('resources.customers.updatedAt')}
                      render={(record) => (
                        <span>{dateFormat(record.updatedAt)}</span>
                      )}
                    />
                  </Item>
                </Grid>
                <Grid item lg={6} md={6} xs={6}>
                  <Item>
                    {translate('resources.customers.createdAt') + ': '}{' '}
                    <FunctionField
                      label={translate('resources.customers.createdAt')}
                      render={(record) => (
                        <span>{dateFormat(record.createdAt)}</span>
                      )}
                    />
                  </Item>
                </Grid>
                <Grid item lg={4} md={6} xs={12}>
                  <Item>
                    <TextField
                      source="firstName"
                      label={translate('resources.customers.firstName')}
                    />
                  </Item>
                </Grid>
                <Grid item lg={4} md={6} xs={12}>
                  <Item>
                    <TextField
                      source="lastName"
                      label={translate('resources.customers.lastName')}
                    />
                  </Item>
                </Grid>
                <Grid item lg={4} md={6} xs={12}>
                  <Item>
                    {translate('resources.customers.email') + ': '}
                    <TextField
                      source="email"
                      label={translate('resources.customers.email')}
                    />
                  </Item>
                </Grid>
                <Grid item lg={4} md={6} xs={12}>
                  <Item>
                    <TextField
                      source="phoneNumber"
                      label={translate('resources.customers.phoneNumber')}
                    />
                  </Item>
                </Grid>
                <Grid item lg={4} md={6} xs={12}>
                  <Item>
                    {translate('resources.customers.countryCode') + ': '}
                    <TextField
                      source="countryCode"
                      label={translate('resources.customers.countryCode')}
                    />
                  </Item>
                </Grid>

                <Grid item lg={4} md={6} xs={12}>
                  <Item>
                    {translate('resources.customers.activationCode') + ': '}
                    <TextField
                      source="activationCode"
                      label={translate('resources.customers.activationCode')}
                    />
                  </Item>
                </Grid>

                <Grid item lg={4} md={6} xs={12}>
                  <Item>
                    {translate('resources.customers.sex') + ': '}
                    <TextField
                      source="sex"
                      label={translate('resources.customers.sex')}
                    />
                  </Item>
                </Grid>
                <Grid item lg={4} md={6} xs={12}>
                  <Item>
                    {translate('resources.customers.internationalCode') + ': '}
                    <TextField
                      source="internationalCode"
                      label={translate('resources.customers.internationalCode')}
                    />
                  </Item>
                </Grid>
                <Grid item lg={4} md={6} xs={12}>
                  <Item>
                    {translate('resources.customers.birthday') + ': '}
                    <TextField
                      source="birthday"
                      label={translate('resources.customers.birthday')}
                    />
                  </Item>
                </Grid>
                <Grid item lg={4} md={6} xs={12}>
                  <Item>
                    {translate('resources.customers.companyName') + ': '}
                    <TextField
                      source="companyName"
                      label={translate('resources.customers.companyName')}
                    />
                  </Item>
                </Grid>
                <Grid item lg={4} md={6} xs={12}>
                  <Item>
                    {translate('resources.customers.companyTelNumber') + ': '}
                    <TextField
                      source="companyTelNumber"
                      label={translate('resources.customers.companyTelNumber')}
                    />
                  </Item>
                </Grid>
              </Grid>
            </Box>
            <ArrayField
              source="address"
              label={translate('resources.customers.address')}>
              <Datagrid>
                <TextField
                  source="Title"
                  label={translate('resources.customers.title')}
                />
                <TextField
                  source="State"
                  label={translate('resources.customers.state')}
                />
                <TextField
                  source="City"
                  label={translate('resources.customers.city')}
                />
                <TextField
                  source="PhoneNumber"
                  label={translate('resources.customers.phoneNumber')}
                />
                <TextField
                  source="PostalCode"
                  label={translate('resources.customers.postalCode')}
                />
                <TextField
                  source="StreetAddress"
                  label={translate('resources.customers.streetAddress')}
                />
              </Datagrid>
            </ArrayField>

            <div style={{ height: '50px' }}></div>

            <FunctionField
              label={translate('resources.customers.orders')}
              render={(record) => <Orders record={record} />}
            />
            <div style={{ height: '50px' }}></div>
            <FunctionField
              label={translate('resources.customers.notifications')}
              render={(record) => <Notifications record={record} />}
            />
            <div style={{ height: '50px' }}></div>
            <FunctionField
              label={translate('resources.customers.transactions')}
              render={(record) => <Transactions record={record} />}
            />
          </Grid>
          <Grid item lg={3} md={4} xs={12}>
            <FunctionField
              label={translate('resources.customers.tasks')}
              render={(record) => <CustomerStatus record={record} />}
            />
            <FunctionField
              label={translate('resources.customers.tasks')}
              render={(record) => <Tasks record={record} />}
            />
            <FunctionField
              label={translate('resources.customers.notes')}
              render={(record) => <Notes record={record} />}
            />
            <FunctionField
              label={translate('resources.customers.documents')}
              render={(record) => <Documents record={record} />}
            />
          </Grid>
        </Grid>
      </SimpleShowLayout>
    </Show>
  );
};

export default customerShow;
