import { Config } from '@nodeeweb/core/src/config/config';
import { Currency, ShopConfigDto } from '../../dto/config';
import store from '../../store';
import {
  DEFAULT_REQ_LIMIT,
  DEFAULT_REQ_WINDOW_LIMIT,
} from '@nodeeweb/core/src/constants/limit';
import { DEFAULT_SMS_ON_OTP } from '@nodeeweb/core';
import {
  DEFAULT_APPROACH_TRANSACTION_EXP,
  DEFAULT_TRANSACTION_EXP_S,
  MAXIMUM_NEED_TO_PAY_TRANSACTION,
  MAX_PRODUCTS_IN_CART,
  MAX_PRODUCT_QUANTITY_IN_CART,
} from '../../constants/limit';
import {
  DEFAULT_APPROACH_TRANSACTION_EXP_MSG,
  DEFAULT_CANCEL_ORDER_MSG,
  DEFAULT_COMPLETE_ORDER_MSG,
  DEFAULT_ENTRY_SUBMIT_MSG,
  DEFAULT_PAID_MSG,
  DEFAULT_POST_ORDER_MSG,
  DEFAULT_REGISTER_MSG,
  DEFAULT_SHOP_INACTIVE_MSG,
} from '../../constants/String';
import { plainToInstance } from 'class-transformer';
import { registerConfig } from '@nodeeweb/core/src/handlers/config.handler';
import logger from '../../utils/log';
import { getEnv } from '@nodeeweb/core/utils/helpers';

export class ShopConfig extends Config<ShopConfigDto> {
  protected get _defaultSetting(): ShopConfigDto {
    return {
      app_name: store.env.APP_NAME ?? 'Nodeeweb Shop',
      host: getEnv('server-host', { format: 'string' }) as string,
      auth: {},
      supervisor:
        store.env.SUPERVISOR_URL && store.env.SUPERVISOR_TOKEN
          ? {
              url: store.env.SUPERVISOR_URL,
              token: store.env.SUPERVISOR_TOKEN,
            }
          : undefined,
      limit: {
        request_limit: DEFAULT_REQ_LIMIT,
        request_limit_window_s: DEFAULT_REQ_WINDOW_LIMIT,
        approach_transaction_expiration: DEFAULT_APPROACH_TRANSACTION_EXP,
        max_product_combination_quantity_in_cart: MAX_PRODUCT_QUANTITY_IN_CART,
        max_products_in_cart: MAX_PRODUCTS_IN_CART,
        transaction_expiration_s: DEFAULT_TRANSACTION_EXP_S,
        max_need_to_pay_transaction: MAXIMUM_NEED_TO_PAY_TRANSACTION,
      },
      currency: Currency.Toman,
      tax: 0,
      shop_active: true,
      shop_inactive_message: DEFAULT_SHOP_INACTIVE_MSG,
      favicon: '/favicon.icon',
      consumer_status: [],
      factor: {
        name: store.env.APP_NAME ?? 'Nodeeweb Shop',
        url: store.env.BASE_URL,
      },
      manual_post: [],
      entry_submit_message: DEFAULT_ENTRY_SUBMIT_MSG,
      sms_message_on: {
        otp: DEFAULT_SMS_ON_OTP,
        register: DEFAULT_REGISTER_MSG,
        approach_transaction_expiration: DEFAULT_APPROACH_TRANSACTION_EXP_MSG,
        cancel_order: DEFAULT_CANCEL_ORDER_MSG,
        complete_order: DEFAULT_COMPLETE_ORDER_MSG,
        post_order: DEFAULT_POST_ORDER_MSG,
        paid_order: DEFAULT_PAID_MSG,
      },
      payment_redirect: '/order/payment',
    };
  }

  protected _transform(value: any): ShopConfigDto {
    return plainToInstance(ShopConfigDto, value, {
      enableImplicitConversion: true,
    });
  }
  protected _filterAuth() {
    const auth = this._config.auth ?? {};
    const fAuth = {};

    // remove secret,pass,key
    Object.keys(auth).forEach((provider) => {
      fAuth[provider] = {};

      Object.keys(auth[provider]).forEach((k) => {
        if (k.includes('secret') || k.includes('pass') || k.includes('key'))
          return;
        fAuth[provider][k] = auth[provider][k];
      });
    });

    return fAuth;
  }

  public getPublic(): Partial<ShopConfigDto> {
    return {
      app_name: this._config.app_name,
      host: this._config.host,
      currency: this._config.currency,
      shop_active: this._config.shop_active,
      shop_inactive_message: this._config.shop_inactive_message,
      tax: this._config.tax,
      auth: this._filterAuth(),
    };
  }
}

export function registerShopConfig() {
  registerConfig(new ShopConfig(), { logger, from: 'ShopConfig' });
}
