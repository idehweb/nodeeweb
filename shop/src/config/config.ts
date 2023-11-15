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
  MAXIMUM_NEED_TO_PAY_ORDER,
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
    const app_name = getEnv<string>('app-name', { format: 'string' });
    const nodeewebApiUrl = getEnv<string>('nodeewebhub_api_base_url', {
      format: 'string',
    });
    const host = getEnv<string>('server-host', { format: 'string' });
    const supervisor_url = getEnv<string>('supervisor-url', {
      format: 'string',
    });
    const supervisor_token = getEnv<string>('supervisor-token', {
      format: 'string',
    });
    const supervisor_whitelist = getEnv<string[]>('supervisor-whitelist', {
      format: 'array',
    });

    return {
      app_name: app_name ?? 'Nodeeweb Shop',
      host,
      favicons: [],
      auth: {
        ...(nodeewebApiUrl
          ? {
              nodeeweb: {
                api_url: nodeewebApiUrl,
              },
            }
          : {}),
      },
      supervisor:
        supervisor_token && supervisor_url
          ? {
              url: supervisor_url,
              token: supervisor_token,
              whitelist: supervisor_whitelist ?? [],
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
        max_need_to_pay_order: MAXIMUM_NEED_TO_PAY_ORDER,
      },
      currency: Currency.Toman,
      tax: 0,
      shop_active: true,
      shop_inactive_message: DEFAULT_SHOP_INACTIVE_MSG,
      consumer_status: [],
      factor: {
        name: app_name ?? 'Nodeeweb Shop',
        url: host,
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
    // rewrite favicon base on first dist in favicons
    if (Array.isArray(value.favicons)) value.favicon = value.favicons[0]?.dist;

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
      favicon: this._config.favicons[0]?.dist,
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
