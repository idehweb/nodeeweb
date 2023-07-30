import { PluginContent } from '@nodeeweb/core/types/plugin';
import { IOrder } from '../schema/order.schema';
import { PaymentVerifyStatus } from './order';

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

export type BankGatewayVerifyArgs = {
  authority: string;
  amount: number;
  status: string;
} & { [key: string]: any };

export type BankGatewayVerify = (
  args: BankGatewayVerifyArgs
) => Promise<{ status: PaymentVerifyStatus }>;

export type BankGatewayUnverified = () => Promise<
  Partial<BankGatewayVerifyArgs>[]
>;

export interface BankGatewayPluginContent extends PluginContent {
  stack: [
    (args: BankGatewayCreateArgs) => Promise<BankGatewayCreateOut>,
    BankGatewayVerify,
    BankGatewayUnverified
  ];
}
export interface PostGatewayPluginContent extends PluginContent {
  stack: [PostGatewaySendPostReq, PostGatewayCalcPrice];
}

export enum PostProvider {
  Manual = 'manual',
}