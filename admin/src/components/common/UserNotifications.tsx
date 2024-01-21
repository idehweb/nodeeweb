import { AlertTitle, Box } from '@mui/material';

import { Loading, useTranslate } from 'react-admin';

import { DataGrid } from '@mui/x-data-grid';

import useFetch from '@/hooks/useFetch';
import { fDateTime } from '@/helpers/date';

export interface UserNotificationsDataProps {
  title: string;
  message: string;
  status: string;
  phone?: string;
  source?: string;
  customerGroup?: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserNotifications({
  phoneNumber,
}: {
  phoneNumber: string;
}) {
  const NotificationsData = useFetch({
    requestQuery: `/notification/0/10000?phone=${phoneNumber}`,
  });

  const translate = useTranslate();

  const data = NotificationsData.data
    ? (NotificationsData.data as { data: [UserNotificationsDataProps] }).data
    : [];

  return (
    <>
      <AlertTitle
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}>
        {translate('resources.notification.user-notifications')}
      </AlertTitle>
      <Box
        sx={{
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          height: '50vh',
          padding: '0.5rem',
        }}>
        {NotificationsData.isLoading ? (
          <Loading />
        ) : NotificationsData.error ? (
          'مشکل!'
        ) : data.length !== 0 ? (
          <>
            <DataGrid
              getRowId={(row) => row.message}
              rows={data}
              columns={[
                { field: 'title', headerName: 'Title', width: 200 },
                { field: 'phone', headerName: 'Phone' },
                {
                  field: 'customerGroup',
                  headerName: 'Customer Group',
                  width: 150,
                },
                { field: 'status', headerName: 'Status' },
                { field: 'message', headerName: 'Message', width: 200 },

                {
                  field: 'updatedAt',
                  headerName: 'Updated At',
                  valueFormatter: (params) => fDateTime(params.value),
                },
              ]}
              style={{ minWidth: '100%' }}
              pageSize={20}
              rowsPerPageOptions={[5, 20, 100]}
              checkboxSelection={false}
              disableSelectionOnClick={true}
            />
          </>
        ) : (
          <>اعلانی برای کاربر وجود ندارد!</>
        )}
      </Box>
    </>
  );
}
