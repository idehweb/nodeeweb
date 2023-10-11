import { PluginContent } from '@nodeeweb/core/types/plugin';
import { IOrder } from '../schema/order.schema';
import { PaymentVerifyStatus } from './order';
import { ShopPost } from '../dto/config';

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
export type BankGatewayCreateOut =
  | { isOk: false; message: string }
  | {
      isOk: true;
      authority: string;
      payment_link: string;
      expiredAt: Date;
      message?: string;
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

export type PostGatewayConfigs = (args: {
  address: Partial<Omit<IOrder['address'], 'receiver'>>;
}) => Promise<ShopPost | ShopPost[] | null>;

export type BankGatewayVerifyArgs = {
  authority: string;
  amount?: number;
  status?: string;
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
  stack: [PostGatewayConfigs, PostGatewaySendPostReq];
}

export enum PostProvider {
  Manual = 'manual',
}
