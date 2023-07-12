import { Receipt, AddShoppingCartOutlined } from '@mui/icons-material';

import orderCreate from './orderCreate';
import orderEdit from './orderEdit';
import orderList from './orderList';

const Order = {
  list: orderList,
  edit: orderEdit,
  create: orderCreate,
  icon: Receipt,
  createIcon: AddShoppingCartOutlined,
};
export default Order;
