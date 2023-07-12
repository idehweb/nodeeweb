import { LibraryAdd, CategoryRounded } from '@mui/icons-material';

import customerGroupCreate from './customerGroupCreate';
import customerGroupEdit from './customerGroupEdit';
import customerGroupList from './customerGroupList';
import customerGroupShow from './customerGroupShow';

const CustomerGroup = {
  list: customerGroupList,
  edit: customerGroupEdit,
  create: customerGroupCreate,
  show: customerGroupShow,
  icon: CategoryRounded,
  createIcon: LibraryAdd,
};
export default CustomerGroup;
