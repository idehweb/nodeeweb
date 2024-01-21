import { DataGrid } from '@mui/x-data-grid';

import { fDateTime } from '@/helpers/date';

export default function UserStatusHistory({
  status,
}: {
  status: [
    { status: string; description: string; createdAt?: string; user?: string },
  ];
}) {
  return (
    <>
      <DataGrid
        style={{ minWidth: '100%' }}
        getRowId={(row) => row.description}
        pageSize={20}
        rowsPerPageOptions={[5, 20, 100]}
        checkboxSelection={false}
        disableSelectionOnClick={true}
        rows={status}
        columns={[
          { field: 'status', headerName: 'status' },
          { field: 'description', headerName: 'Description' },
          {
            field: 'createdAt',
            headerName: 'Created At',
            valueFormatter: (params) => fDateTime(params.value),
            width: 100,
          },
        ]}
      />
    </>
  );
}
