import crypto from 'crypto';
import MellatCheckout from 'mellat-checkout';
import {
  BankGatewayPluginContent,
  BankGatewayUnverified,
  PaymentVerifyStatus,
} from './type';

const errorCodeMap = {
  11: 'ﺷﻤﺎره_ﻛﺎرت_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ',
  12: 'ﻣﻮﺟﻮدي_ﻛﺎﻓﻲ_ﻧﻴﺴﺖ',
  13: 'رﻣﺰ_ﻧﺎدرﺳﺖ_اﺳﺖ',
  14: 'ﺗﻌﺪاد_دﻓﻌﺎت_وارد_ﻛﺮدن_رﻣﺰ_ﺑﻴﺶ_از_ﺣﺪ_ﻣﺠﺎز_اﺳﺖ',
  15: 'ﻛﺎرت_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ',
  16: 'دﻓﻌﺎت_ﺑﺮداﺷﺖ_وﺟﻪ_ﺑﻴﺶ_از_ﺣﺪ_ﻣﺠﺎز_اﺳﺖ',
  17: 'ﻛﺎرﺑﺮ_از_اﻧﺠﺎم_ﺗﺮاﻛﻨﺶ_ﻣﻨﺼﺮف_ﺷﺪه_اﺳﺖ',
  18: 'ﺗﺎرﻳﺦ_اﻧﻘﻀﺎي_ﻛﺎرت_ﮔﺬﺷﺘﻪ_اﺳﺖ',
  19: 'ﻣﺒﻠﻎ_ﺑﺮداﺷﺖ_وﺟﻪ_ﺑﻴﺶ_از_ﺣﺪ_ﻣﺠﺎز_اﺳﺖ',

  111: 'ﺻﺎدر_ﻛﻨﻨﺪه_ﻛﺎرت_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ',
  112: 'ﺧﻄﺎي_ﺳﻮﻳﻴﭻ_ﺻﺎدر_ﻛﻨﻨﺪه_ﻛﺎرت',
  113: 'ﭘﺎﺳﺨﻲ_از_ﺻﺎدر_ﻛﻨﻨﺪه_ﻛﺎرت_درﻳﺎﻓﺖ_ﻧﺸﺪ',
  114: 'دارﻧﺪه_ﻛﺎرت_ﻣﺠﺎز_ﺑﻪ_اﻧﺠﺎم_اﻳﻦ_ﺗﺮاﻛﻨﺶ_ﻧﻴﺴﺖ',

  21: 'ﭘﺬﻳﺮﻧﺪه_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ',
  23: 'ﺧﻄﺎي_اﻣﻨﻴﺘﻲ_رخ_داده_اﺳﺖ',
  24: 'اﻃﻼﻋﺎت_ﻛﺎرﺑﺮي_ﭘﺬﻳﺮﻧﺪه_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ',
  25: 'ﻣﺒﻠﻎ_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ',
  31: 'ﭘﺎﺳﺦ_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ',
  32: 'ﻓﺮﻣﺖ_اﻃﻼﻋﺎت_وارد_ﺷﺪه_ﺻﺤﻴﺢ_ﻧﻤﻲ_ﺑﺎﺷﺪ',
  33: 'ﺣﺴﺎب_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ',
  34: 'ﺧﻄﺎي_ﺳﻴﺴﺘﻤﻲ',
  35: 'ﺗﺎرﻳﺦ_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ',
  41: 'ﺷﻤﺎره_درﺧﻮاﺳﺖ_ﺗﻜﺮاري_اﺳﺖ',
  42: 'ﺗﺮاﻛﻨﺶ_Sale_یافت_نشد_',
  43: 'ﺒﻼ_Verify_درﺧﻮاﺳﺖ_داده_ﺷﺪه_اﺳﺖ',
  44: 'درخواست_verify_یافت_نشد',
  45: 'ﺗﺮاﻛﻨﺶ_Settle_ﺷﺪه_اﺳﺖ',
  46: 'ﺗﺮاﻛﻨﺶ_Settle_نشده_اﺳﺖ',
  47: 'ﺗﺮاﻛﻨﺶ_Settle_یافت_نشد',
  48: 'تراکنش_Reverse_شده_است',
  49: 'تراکنش_Refund_یافت_نشد',

  412: 'شناسه_قبض_نادرست_است',
  413: 'ﺷﻨﺎﺳﻪ_ﭘﺮداﺧﺖ_ﻧﺎدرﺳﺖ_اﺳﺖ',
  414: 'سازﻣﺎن_ﺻﺎدر_ﻛﻨﻨﺪه_ﻗﺒﺾ_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ',
  415: 'زﻣﺎن_ﺟﻠﺴﻪ_ﻛﺎري_ﺑﻪ_ﭘﺎﻳﺎن_رسیده_است',
  416: 'ﺧﻄﺎ_در_ﺛﺒﺖ_اﻃﻼﻋﺎت',
  417: 'ﺷﻨﺎﺳﻪ_ﭘﺮداﺧﺖ_ﻛﻨﻨﺪه_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ',
  418: 'اﺷﻜﺎل_در_ﺗﻌﺮﻳﻒ_اﻃﻼﻋﺎت_ﻣﺸﺘﺮي',
  419: 'ﺗﻌﺪاد_دﻓﻌﺎت_ورود_اﻃﻼﻋﺎت_از_ﺣﺪ_ﻣﺠﺎز_ﮔﺬﺷﺘﻪ_اﺳﺖ',
  421: 'IP_نامعتبر_است',

  51: 'ﺗﺮاﻛﻨﺶ_ﺗﻜﺮاري_اﺳﺖ',
  54: 'ﺗﺮاﻛﻨﺶ_ﻣﺮﺟﻊ_ﻣﻮﺟﻮد_ﻧﻴﺴﺖ',
  55: 'ﺗﺮاﻛﻨﺶ_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ',
  61: 'ﺧﻄﺎ_در_واریز',
};

let config: {
  password: string;
  username: string;
  terminalId: number;
  mellat: any;
  resolve: (key: string) => any;
};

function errorLog(from: string, err: any) {
  const logger = config.resolve('logger');
  const parser = config.resolve('axiosError2String');
  logger.error(`${from} error:`, parser(err));
}
const mockCreate = async () => {
  return {
    isOk: true,
    authority: `mock-create_${Date.now()}`,
    expiredAt: new Date(Date.now() + 15 * 60 * 1000),
    payment_link: 'https://bpm.shaparak.ir/pgwchannel/startpay.mellat',
    payment_method: 'post',
    payment_headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    payment_body: {
      RefId: Date.now() + '',
    },
    payment_message: 'در حال هدایت به صفحه خرید...',
  };
};
const create: BankGatewayPluginContent['stack'][0] = async ({
  callback_url,
  amount,
  currency,
}) => {
  try {
    await config.mellat.initialize();

    const generatedOrderId = crypto.randomInt(10 ** 4, 10 ** 6);

    const response = await config.mellat.paymentRequest({
      amount: currency === 'Toman' ? amount * 10 : amount,
      orderId: generatedOrderId,
      callbackUrl: callback_url,
    });

    if (response.resCode === 0)
      return {
        isOk: true,
        authority: `${generatedOrderId}_${response.refId}`,
        expiredAt: new Date(Date.now() + 15 * 60 * 1000),
        payment_link: 'https://bpm.shaparak.ir/pgwchannel/startpay.mellat',
        payment_method: 'post',
        payment_headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        payment_body: {
          RefId: response.refId,
        },
        payment_message: 'در حال هدایت به صفحه خرید...',
      };

    throw new Error(errorCodeMap[response.resCode] || 'Gateway has error');
  } catch (err) {
    errorLog('create', err);
    return { isOk: false, message: err.message };
  }
};

const verify: BankGatewayPluginContent['stack'][1] = async ({
  authority,
  SaleOrderId,
  RefId,
}) => {
  try {
    await config.mellat.initialize();

    const [orderId] = authority.split('_');
    const response = await config.mellat.verifyPayment({
      orderId,
      saleOrderId: SaleOrderId,
      saleReferenceId: RefId,
    });
    if (response.resCode === 0) return { status: PaymentVerifyStatus.Paid };
    throw new Error(errorCodeMap[response.resCode] || 'Gateway has error');
  } catch (error) {
    errorLog('verify', error);
    return { status: PaymentVerifyStatus.Failed, message: error.message };
  }
};

const unverified: BankGatewayUnverified = async () => {
  return [];
};

function add(arg: any): BankGatewayPluginContent['stack'] {
  config = arg;
  config.mellat = new MellatCheckout({
    terminalId: config.terminalId,
    username: config.username,
    password: config.password,
  });
  return [create, verify, unverified];
}

function edit(arg: any): BankGatewayPluginContent['stack'] {
  config = arg;
  config.mellat = new MellatCheckout({
    terminalId: config.terminalId,
    username: config.username,
    password: config.password,
  });

  return [create, verify, unverified];
}

export { add as config, add as active, edit };
