import { OrderUtils } from './utils';

export default class OrderViewValidation {
  static address() {
    return true;
  }

  static post() {
    return Boolean(OrderUtils.getAddressChose());
  }
}
