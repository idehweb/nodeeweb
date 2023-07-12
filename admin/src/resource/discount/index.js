import DiscountIcon from '@mui/icons-material/Discount';

import { LibraryAdd, CategoryRounded } from '@mui/icons-material';

import discountCreate from './discountCreate';
import discountEdit from './discountEdit';
import discountList from './discountList';
import discountShow from './discountShow';

const Discount = {
  list: discountList,
  edit: discountEdit,
  create: discountCreate,
  show: discountShow,
  icon: DiscountIcon,
  createIcon: LibraryAdd,
};
export default Discount;
