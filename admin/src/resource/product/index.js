import { Storefront, LocalMall } from '@mui/icons-material';

import productCreate from './productCreate';
import productEdit from './productEdit';
import productList from './productList';
import productShow from './productShow';

const Product = {
  list: productList,
  edit: productEdit,
  create: productCreate,
  show: productShow,
  icon: Storefront,
  createIcon: LocalMall,
};
export default Product;
