export interface WebAppConfigProps {
  app_name: string;
  meta_title: string;
  meta_description: string;
  consumer_status: consumer_statusProps[];
  currency: CurrencyProps;
  entry_submit_message: string;
  factor: FactorProps;
  favicon_id?: string;
  favicons?: string[];
  host: string;
  limit: LimitProps;
  manual_post: ManualPostProps[];
  sms_message_on: SmsProps;
  supervisor: SupervisorProps;
  shop_active: boolean;
  shop_inactive_message: string;
  payment_redirect: string;
  tax: number;
  head_first?: string;
  head_last?: string;
  body_first?: string;
  body_last?: string;
  color?: ColorProps;
}

export interface consumer_statusProps {
  key: string;
  value: string;
}

export interface CurrencyProps {
  Toman: 'Toman';
  Rial: 'Rial';
}

export interface FactorProps {
  name: string;
  url: string;
  address?: string;
  tel?: string;
  fax?: string;
  postalCode?: string;
  registrationCode?: string;
  economicCode?: string;
}

export interface LimitProps {
  approach_transaction_expiration: number;
  max_need_to_pay_order: number;
  max_need_to_pay_transaction: number;
  max_product_combination_quantity_in_cart: number;
  max_products_in_cart: number;
  request_limit: number;
  request_limit_window_s: number;
  transaction_expiration_s: number;
}

export interface ColorProps {
  primary: string;
}

export interface SupervisorProps {
  url: string;
  token: string;
  whitelist: unknown[];
}

export interface SmsProps {
  approach_transaction_expiration: string;
  paid_order: string;
  cancel_order: string;
  post_order: string;
  complete_order: string;
}

export interface ManualPostProps {
  id: string;
  provider: string;
  title: string;
  description: string;
  active: boolean;
  price?: number;
  priceFormula?: string;
  base_price?: number;
  min_price?: number;
  max_price?: number;
  cities?: string[];
  states?: {
    id: string;
    name: string;
  }[];
  products_min_price: number;
  products_max_price: number;
  products_min_weight: number;
  products_max_weight: number;
}

export interface UploadedImageProps {
  __v: number;
  _id: string;
  createdAt: string;
  type: string;
  updatedAt: string;
  url: string;
}
