import {
  BankGatewayPluginContent,
  BankGatewayUnverified,
  PaymentVerifyStatus,
} from './type';

let config: {
  redirect: string;
  lifeTime?: number;
  resolve: (key: string) => any;
};

function errorLog(from: string, err: any) {
  const logger = config.resolve('logger');
  const parser = config.resolve('axiosError2String');
  logger.error(`${from} error:`, parser(err));
}

const create: BankGatewayPluginContent['stack'][0] = async () => {
  return {
    isOk: true,
    expiredAt: new Date(
      Date.now() + (config.lifeTime ?? 7) * 24 * 60 * 60 * 1000
    ),
    authority: new Date().toISOString(),
    payment_link: config.redirect,
  };
};

const verify: BankGatewayPluginContent['stack'][1] = async () => {
  const error = new Error('manual payment does not have verify');
  errorLog('verify', error);
  return {
    status: PaymentVerifyStatus.Failed,
    message: error.message,
  };
};

const unverified: BankGatewayUnverified = async () => {
  return [];
};

function add(arg: any): BankGatewayPluginContent['stack'] {
  config = arg;
  return [create, verify, unverified];
}

function edit(arg: any): BankGatewayPluginContent['stack'] {
  config = arg;
  return [create, verify, unverified];
}

export { add as config, add as active, edit };
