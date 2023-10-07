import store from '../store';

export default class OrderViewValidation {
  static address() {
    return true;
  }

  static post() {
    const { user, address_hover } = store.getState().store;
    const choseAddress = isNaN(address_hover)
      ? null
      : user?.address?.[address_hover];
    return choseAddress;
  }
}
