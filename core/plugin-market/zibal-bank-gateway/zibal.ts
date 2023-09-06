import axios from 'axios';
import { PaymentVerifyStatus } from './type';

type ExtraProperties = {
  mobile?: string;
  description?: string;
  feeMode?: number;
};

type Config = {
  merchant: string;
  callbackUrl?: string;
  logLevel?: number;
};

export default class Zibal {
  // private
  static api = {
    base: 'https://gateway.zibal.ir',
  };
  constructor(private config: Config) {}

  static extraProperties = [
    'mobile',
    'description',
    'multiplexingInfos',
    'feeMode',
    'percentMode',
  ];

  static errors = {
    invalidConfig: 'Invalid Configuration',
  };

  async request(
    amount: number,
    extras: ExtraProperties = {}
  ): Promise<{ isOk: boolean; message: string; trackId: number }> {
    const { errors, extractExtras, post } = Zibal;
    const config = this.config;
    const { merchant, callbackUrl } = config;
    const data = {
      merchant,
      callbackUrl,
      amount: parseInt(amount + ''),
      ...extractExtras(extras),
    };
    const { data: res } = await post('request/lazy', data);
    let message = res.message,
      isOk = false;
    switch (res.result) {
      case 100:
        message = 'با موفقیت تایید شد.';
        isOk = true;
        break;
      case 102:
        message = `${merchant} یافت نشد.`;
        break;
      case 103:
        message = `${merchant} غیرفعال`;
        break;
      case 104:
        message = `${merchant} نامعتبر`;
        break;
      case 201:
        message = `قبلا تایید شده.`;
        break;
      case 105:
        message = `${amount} بایستی بزرگتر از 1,000 ریال باشد.`;
        break;
      case 106:
        message = `${callbackUrl} نامعتبر می‌باشد. (شروع با http و یا https)`;
        break;
    }
    return {
      ...res,
      isOk,
      message,
    };
  }

  startURL(trackId: number) {
    return `${Zibal.api.base}/start/${trackId}`;
  }

  async verify(
    trackId: string
  ): Promise<{ status: PaymentVerifyStatus; message: string }> {
    const { post } = Zibal;
    const config = this.config;
    const { merchant } = config;
    const data = {
      trackId,
      merchant,
    };
    const { data: res } = await post('verify', data);
    let message = res.message,
      status = PaymentVerifyStatus.Failed;
    switch (res.result) {
      case 100:
        message = `با موفقیت تایید شد.`;
        status = PaymentVerifyStatus.Paid;
        break;
      case 102:
        message = `${merchant} یافت نشد.`;
        break;
      case 103:
        message = `${merchant} غیرفعال`;
        break;
      case 104:
        message = `${merchant} نامعتبر`;
        break;
      case 201:
        message = `قبلا تایید شده.`;
        status = PaymentVerifyStatus.CheckBefore;
        break;
      case 202:
        message = `سفارش پرداخت نشده یا ناموفق بوده است. `;
        break;
      case 203:
        message = `${trackId} نامعتبر می‌باشد.`;
        break;
    }
    return {
      ...res,
      message,
      status,
    };
  }

  // private
  static extractExtras(obj: any) {
    return obj
      ? Zibal.extraProperties.reduce((a, c) => ({ ...a, [c]: obj[c] }), {})
      : {};
  }

  // private
  static post(path: string, body: any) {
    const { api } = Zibal;
    const uri = `${api.base}/${path}`;
    return axios.post(uri, body);
  }
}
