import {
  BankGatewayPluginContent,
  BankGatewayUnverified,
  PaymentVerifyStatus,
} from './type';
import Zibal from './zibal';

let config: { merchant: string; resolve: (key: string) => any };

function errorLog(from: string, err: any) {
  const logger = config.resolve('logger');
  const parser = config.resolve('axiosError2String');
  logger.error(`${from} error:`, parser(err));
}

const create: BankGatewayPluginContent['stack'][0] = async ({
  amount,
  callback_url,
  currency,
  description,
  userPhone,
}) => {
  const zibal = new Zibal({
    merchant: config.merchant,
    callbackUrl: callback_url,
  });

  if (currency === 'Toman') amount *= 10;

  try {
    const response = await zibal.request(amount, {
      description,
      feeMode: 0,
      mobile: userPhone,
    });
    const expD = new Date();
    expD.setMinutes(expD.getMinutes() + 20);
    return {
      isOk: response.isOk,
      authority: response.trackId ? response.trackId + '' : undefined,
      expiredAt: expD,
      payment_link: response.trackId
        ? zibal.startURL(response.trackId)
        : undefined,
      message: response.message,
    };
  } catch (err) {
    errorLog('create', err);
    return {
      isOk: false,
      message: err.message,
    };
  }
};

const verify: BankGatewayPluginContent['stack'][1] = async ({
  amount,
  authority,
  status,
}) => {
  const zibal = new Zibal({ merchant: config.merchant });
  try {
    const resonse = await zibal.verify(authority);
    return resonse;
  } catch (err) {
    errorLog('verify', err);
    return {
      status: PaymentVerifyStatus.Failed,
      message: err.message,
    };
  }
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
