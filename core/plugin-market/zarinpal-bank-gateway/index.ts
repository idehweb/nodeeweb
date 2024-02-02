import {
  BankGatewayPluginContent,
  BankGatewayUnverified,
  PaymentVerifyStatus,
} from './type';
import Zarinpal from './zarinpal';

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
  const zarinpal = new Zarinpal({
    merchant: config.merchant,
    callbackUrl: callback_url,
  });
  amount = +amount;

  if (currency === 'Toman') amount *= 10;

  try {
    const response = await zarinpal.request(amount, {
      description,
      mobile: userPhone,
    });
    const expD = new Date();
    expD.setMinutes(expD.getMinutes() + 20);
    return {
      isOk: response.isOk,
      authority: response.authority,
      expiredAt: expD,
      payment_link: response.authority
        ? zarinpal.startURL(response.authority)
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
  transaction,
}) => {
  amount = +amount;
  const currency = transaction.currency;
  if (currency === 'Toman') amount *= 10;
  const zarinpal = new Zarinpal({ merchant: config.merchant });
  try {
    const response = await zarinpal.verify(authority, amount);
    return response;
  } catch (err) {
    errorLog('verify', err);
    return {
      status: PaymentVerifyStatus.Failed,
      message: err.message,
    };
  }
};

const unverified: BankGatewayUnverified = async () => {
  const zarinpal = new Zarinpal({
    merchant: config.merchant,
  });

  return await zarinpal.unverified();
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
