import { GroupAdd, Group } from '@mui/icons-material';

import customerCreate from './customerCreate';
import customerEdit from './customerEdit';
import CustomerShow from './customerShow';
import customerList from './customerList';

const Customer = {
  list: customerList,
  create: customerCreate,
  edit: customerEdit,
  show: CustomerShow,
  icon: Group,
  createIcon: GroupAdd,
};
export default Customer;
