import {
  BankGatewayPluginContent,
  BankGatewayUnverified,
  PaymentVerifyStatus,
} from './type';
import { BPM } from './bpm';
import { random } from 'lodash';

let config: {
  password: string;
  username: string;
  terminalId: number;
  bpm: BPM;
  resolve: (key: string) => any;
};

function errorLog(from: string, err: any) {
  const logger = config.resolve('logger');
  const parser = config.resolve('axiosError2String');
  logger.error(`${from} error:`, parser(err));
}

const create: BankGatewayPluginContent['stack'][0] = async ({
  callback_url,
  amount,
  currency,
  description,
}) => {
  config.bpm.callbackUrl = callback_url;
  let payRequestResult = await config.bpm.bpPayRequest(
    random(0, Number.MAX_SAFE_INTEGER, false),
    currency === 'Toman' ? amount * 10 : amount,
    description
  );
  console.log(payRequestResult);
  payRequestResult = payRequestResult.return;
  payRequestResult = payRequestResult.split(',');

  if (parseInt(payRequestResult[0]) === 0) {
    return {
      isOk: true,
      authority: payRequestResult[1],
      expiredAt: new Date(Date.now() + 15 * 60 * 1000),
      payment_link: `${BPM.PgwSite}/?RefId=${payRequestResult[1]}`,
    };
  } else {
    if (payRequestResult[0] === null) {
      throw new Error(
        'هیچ شماره پیگیری برای پرداخت از سمت بانک ارسال نشده است!'
      );
    } else {
      let error = config.bpm
        .desribtionStatusCode(parseInt(payRequestResult))
        .replace(/_/g, ' ');
      console.log(error);
      throw new Error(error);
    }
  }
};

const verify: BankGatewayPluginContent['stack'][1] = async ({
  amount,
  authority,
  status,
  data,
}) => {
  let saleReferenceId = -999;
  let saleOrderId = -999;
  let resultCode_bpPayRequest;

  saleReferenceId = parseInt(data.SaleReferenceId, 10);
  saleOrderId = parseInt(data.SaleOrderId, 10);
  resultCode_bpPayRequest = parseInt(data.ResCode);
  console.log(data);

  //Result Code

  if (resultCode_bpPayRequest === 0) {
    //verify request
    let result = await config.bpm.bpVerifyRequest(
      saleOrderId,
      saleOrderId,
      saleReferenceId
    );
    result = result.return;
    console.log('bpVerifyRequest:' + result);

    if (result === null || result.length === 0) {
      //Inquiry Request
      let resultCode_bpinquiryRequest = await config.bpm.bpInquiryRequest(
        saleOrderId,
        saleOrderId,
        saleReferenceId
      );
      resultCode_bpinquiryRequest = parseInt(
        resultCode_bpinquiryRequest.return
      );
      console.log('bpinquiryRequest' + resultCode_bpinquiryRequest);

      if (resultCode_bpinquiryRequest !== 0) {
        reversePay(saleOrderId, saleOrderId, saleReferenceId);
        const error = desribtionStatusCode(resultCode_bpinquiryRequest);

        return res.render('mellat_payment_result.ejs', { error });
      }
    }

    if (
      parseInt(resultCode_bpVerifyRequest) === 0 ||
      resultCode_bpinquiryRequest === 0
    ) {
      //SettleRequest
      resultCode_bpSettleRequest = await bpSettleRequest(
        saleOrderId,
        saleOrderId,
        saleReferenceId
      );
      resultCode_bpSettleRequest = parseInt(resultCode_bpSettleRequest.return);
      console.log('bpSettleRequest' + resultCode_bpSettleRequest);

      //ﺗﺮاﻛﻨﺶ_Settle_ﺷﺪه_اﺳﺖ
      //ﺗﺮاﻛﻨﺶ_ﺑﺎ_ﻣﻮﻓﻘﻴﺖ_اﻧﺠﺎم_ﺷﺪ
      if (
        resultCode_bpSettleRequest === 0 ||
        resultCode_bpSettleRequest === 45
      ) {
        //success payment
        let msg = 'تراکنش شما با موفقیت انجام شد ';
        msg += ' لطفا شماره پیگیری را یادداشت نمایید' + saleReferenceId;

        //save success payment into db

        return res.render('mellat_payment_result.ejs', { msg });
      }
    } else {
      if (saleOrderId != -999 && saleReferenceId != -999) {
        if (resultCode_bpPayRequest !== 17)
          reversePay(saleOrderId, saleOrderId, saleReferenceId);
      }

      const error = desribtionStatusCode(resultCode_bpVerifyRequest);

      return res.render('mellat_payment_result.ejs', { error });
    }
  } else {
    if (saleOrderId != -999 && saleReferenceId != -999) {
      if (resultCode_bpPayRequest !== 17)
        reversePay(saleOrderId, saleOrderId, saleReferenceId);
      const error = desribtionStatusCode(resultCode_bpPayRequest);

      return res.render('mellat_payment_result.ejs', { error });
    }
  }
};

const unverified: BankGatewayUnverified = async () => {
  return [];
};

function add(arg: any): BankGatewayPluginContent['stack'] {
  config = arg;
  config.bpm = new BPM({
    callbackUrl: '',
    password: config.password,
    terminalId: config.terminalId,
    username: config.username,
  });

  return [create, verify, unverified];
}

function edit(arg: any): BankGatewayPluginContent['stack'] {
  config = arg;
  config.bpm = new BPM({
    callbackUrl: '',
    password: config.password,
    terminalId: config.terminalId,
    username: config.username,
  });

  return [create, verify, unverified];
}

export { add as config, add as active, edit };
