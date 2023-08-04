import { store } from '@nodeeweb/core';

export const TRANSACTION_ON_EXPIRE_MESSAGE =
  store.env.TRANSACTION_ON_EXPIRE_MESSAGE ??
  `ما تنها مدت کوتاهی می‌توانیم سفارش‌تان را نگه ‌داریم و در صورت عدم پرداخت، ناچار به لغو آن هستیم. برای نهایی کردن، از بخش «پیگیری سفارش‌ها» مبلغ آن را پرداخت‌ کنید. شماره سفارش: %ORDER_ID% %BASE_URL%`;

export const ORDER_STATUS_CHANGE_MESSAGE =
  store.env.ORDER_STATUS_CHANGE_MESSAGE ??
  `%APP_NAME% %CUSTOMER_FIRST_NAME% عزیز وضعیت سفارش به حالت «%ORDER_STATUS%» تغییر پیدا کرد. شماره سفارش: %ORDER_ID% %BASE_URL%`;
