import { Plugin } from '@nodeeweb/core/types/plugin';
import {
  BankGatewayPluginContent,
  BankGatewayUnverified,
  ShopPluginType,
} from '../../types/plugin';
import { PaymentVerifyStatus } from '../../types/order';

const create: BankGatewayPluginContent['stack'][0] = async ({}) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 15);
  return {
    authority: Math.random() + '',
    expiredAt: d,
    payment_link: 'https://example.com',
  };
};

const verify: BankGatewayPluginContent['stack'][1] = async () => {
  return { status: PaymentVerifyStatus.Paid };
};

const unverified: BankGatewayUnverified = async () => {
  return [{ authority: 'authority', amount: 5 }];
};

const bankGatewayPlugin: Plugin = () => {
  const content: BankGatewayPluginContent = {
    name: 'shop-bank-gateway',
    stack: [create, verify, unverified],
  };
  return {
    type: ShopPluginType.BANK_GATEWAY,
    content,
  };
};

export default bankGatewayPlugin;
