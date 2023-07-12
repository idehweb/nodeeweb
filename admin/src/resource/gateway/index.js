import { LibraryAdd, CategoryRounded } from '@mui/icons-material';

import gatewayCreate from './gatewayCreate';
import gatewayEdit from './gatewayEdit';
import gatewayList from './gatewayList';
import gatewayShow from './gatewayShow';

const Gateway = {
  list: gatewayList,
  edit: gatewayEdit,
  create: gatewayCreate,
  show: gatewayShow,
  icon: CategoryRounded,
  createIcon: LibraryAdd,
};
export default Gateway;
