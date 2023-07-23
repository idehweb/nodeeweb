import { PluginContent } from '@nodeeweb/core/types/plugin';
import { IOrder } from '../schema/order.schema';

export enum ShopPluginType {
  BANK_GATEWAY = 'bank-gateway',
  POST_GATEWAY = 'post-gateway',
}

export type BankGatewayCreateArgs = {
  amount: number;
  userPhone: string;
  callback_url: string;
  description: string;
  currency: string;
};
export type BankGatewayCreateOut = {
  authority: string;
  payment_link: string;
  expiredAt: Date;
};
export type PostGatewaySendPostReq = (args: {
  products: {
    size?: string;
    weight?: number;
    price?: number;
  }[];
  address: IOrder['address'];
}) => Promise<
  IOrder['post'] & {
    price: number;
  }
>;

export type PostGatewayCalcPrice = (args: {
  products: {
    size?: string;
    weight?: number;
    price?: number;
  }[];
  address: Omit<IOrder['address'], 'receiver'>;
}) => Promise<
  IOrder['post'] & {
    price: number;
  }
>;

export interface BankGatewayPluginContent extends PluginContent {
  stack: [(args: BankGatewayCreateArgs) => Promise<BankGatewayCreateOut>];
}
export interface PostGatewayPluginContent extends PluginContent {
  stack: [PostGatewaySendPostReq, PostGatewayCalcPrice];
}

export enum PostProvider {
  Manual = 'manual',
}
