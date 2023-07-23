import { UserDocument } from '@nodeeweb/core/types/auth';
import { OrderDocument } from '../../schema/order.schema';

export class Utils {
  async sendOnStateChange(order: OrderDocument) {}
  async sendOnExpire(order: OrderDocument) {}
}

const utils = new Utils();

export default utils;
