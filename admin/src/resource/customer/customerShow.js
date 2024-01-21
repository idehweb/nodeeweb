import {
  FunctionField,
  Loading,
  Show,
  SimpleShowLayout,
  TextField,
  useTranslate,
} from 'react-admin';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import { Suspense } from 'react';

import { dateFormat } from '@/functions';
import { UserNotifications, UserStatusHistory } from '@/components/common';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export const CustomerShow = (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
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
                    {translate('resources.customers.firstName') + ': '}

                    <TextField
                      source="firstName"
                      label={translate('resources.customers.firstName')}
                    />
                  </Item>
                </Grid>
                <Grid item lg={4} md={6} xs={12}>
                  <Item>
                    {translate('resources.customers.lastName') + ': '}

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
                    {translate('resources.customers.phone') + ': '}

                    <TextField
                      source="phone"
                      label={translate('resources.customers.phone')}
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
            <div>
              <Suspense fallback={<Loading />}>
                <FunctionField
                  label={translate('resources.customers.updatedAt')}
                  render={(record) => (
                    <UserNotifications phoneNumber={record.phone} />
                  )}
                />
              </Suspense>
            </div>
          </Grid>

          <Grid item lg={3} md={4} xs={12}>
            <Suspense fallback={<Loading />}>
              <FunctionField
                label={translate('resources.customers.updatedAt')}
                render={(record) => (
                  <UserStatusHistory status={record.status} />
                )}
              />
            </Suspense>
          </Grid>
        </Grid>
      </SimpleShowLayout>
    </Show>
  );
};

export default CustomerShow;
