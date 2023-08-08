import { store } from '@nodeeweb/core';

export const DEFAULT_PRODUCT_QUANTITY_IN_CART = 100;
export const DEFAULT_PRODUCTS_IN_CART = 100;
export const MAXIMUM_NEED_TO_PAY_TRANSACTION =
  +store.env.MAXIMUM_NEED_TO_PAY_TRANSACTION || 3;
export const INACTIVE_PRODUCT_TIME =
  +store.env.INACTIVE_PRODUCT_TIME || 15 * 60 * 1_000;
