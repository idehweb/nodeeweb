import store from '../store';

export class OrderUtils {
  static getAddressChose() {
    const { user, address_hover } = store.getState().store;
    const choseAddress = isNaN(address_hover)
      ? null
      : user?.address?.[address_hover];
    return choseAddress;
  }

  static getPostChose() {
    return store.getState().store?.postChose;
  }
}
