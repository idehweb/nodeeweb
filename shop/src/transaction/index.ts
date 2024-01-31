import { green } from '@nodeeweb/core/utils/color';
import logger from '../../utils/log';
import registerTransactionController from './controller';
import paymentService from './payment.service';

export default async function registerTransaction() {
  registerTransactionController();
  await paymentService.synchronize();
  logger.log(green('[ShopPayment] successfully synchronize payments'));
}
