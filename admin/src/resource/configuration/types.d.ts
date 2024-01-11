export interface WebAppConfigProps {
  app_name: string;
  consumer_status: {
    key: string;
    value: string;
  }[];
  currency: {
    Toman: 'Toman';
    Rial: 'Rial';
  };
  entry_submit_message: string;
  factor: {
    name: string;
    url: string;
    address?: string;
    tel?: string;
    fax?: string;
    postalCode?: string;
    registrationCode?: string;
    economicCode?: string;
  };
  favicon?: string;
  favicons?: string[];
  host: string;
  limit: {
    approach_transaction_expiration: number;
    max_need_to_pay_order: number;
    max_need_to_pay_transaction: number;
    max_product_combination_quantity_in_cart: number;
    max_products_in_cart: number;
    request_limit: number;
    request_limit_window_s: number;
    transaction_expiration_s: number;
  };
  manual_post: {
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
  }[];
  sms_message_on: {
    approach_transaction_expiration: string;
    paid_order: string;
    cancel_order: string;
    post_order: string;
    complete_order: string;
  };
  supervisor: {
    url: string;
    token: string;
    whitelist: unknown[];
  };
  shop_active: boolean;
  shop_inactive_message: string;
  payment_redirect: string;
  tax: number;
  head_first?: string;
  head_last?: string;
  body_first?: string;
  body_last?: string;
  color?: {
    primary: string;
  };
}
