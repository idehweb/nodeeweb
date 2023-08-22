import {
  BankGatewayPluginContent,
  BankGatewayUnverified,
  PaymentVerifyStatus,
} from './type';

let config: { merchant: string };

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

export function add(arg: any): BankGatewayPluginContent['stack'] {
  config = arg;
  return [create, verify, unverified];
}

export function edit(arg: any): BankGatewayPluginContent['stack'] {
  config = arg;
  return [create, verify, unverified];
}
