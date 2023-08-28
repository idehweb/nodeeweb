import { ListBase, Pagination, useListContext, Datagrid } from 'react-admin';
import { Box } from '@mui/material';

import {
  CustomFileField,
  GridList,
  List,
  SimpleForm,
  UploaderField,
} from '@/components';

const list = (props) => {
  return (
    <ListBase
      perPage={20}
      sort={{ field: 'reference', order: 'ASC' }}
      {...props}>
      <Box className={'grid-box'}>
        <GridList {...props} />
      </Box>
      <Pagination rowsPerPageOptions={[10, 20, 40]} />
    </ListBase>
  );
};

export default list;
