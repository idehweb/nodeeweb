import { UserDocument } from '@nodeeweb/core/types/auth';
import { OrderDocument } from '../../schema/order.schema';

export class Utils {
  async sendOnStateChange(user: UserDocument, order: OrderDocument) {}
  async sendOnExpire(user: UserDocument, order: OrderDocument) {}
}

const utils = new Utils();

export default utils;
