import { MonetizationOn } from '@mui/icons-material';

import transactionCreate from './transactionCreate';
import transactionShow from './transactionShow';
import transactionList from './transactionList';

const Transaction = {
  list: transactionList,
  show: transactionShow,
  edit: transactionShow,
  create: transactionCreate,
  icon: MonetizationOn,
};
export default Transaction;
