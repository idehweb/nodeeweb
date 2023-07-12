import { GroupAdd, Group } from '@mui/icons-material';

import customerCreate from './customerCreate';
import customerEdit from './customerEdit';
import customerShow from './customerShow';
import customerList from './customerList';


const Customer = {
  list: customerList,
  create: customerCreate,
  edit: customerEdit,
  show: customerShow,
  icon: Group,
  createIcon: GroupAdd,
};
export default Customer;
