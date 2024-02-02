import axios from 'axios';
import { PaymentVerifyStatus } from './type';

type ExtraProperties = {
  mobile?: string;
  description?: string;
};

type Config = {
  merchant: string;
  callbackUrl?: string;
  logLevel?: number;
};

const errors = {
  '-11':
    'مرچنت کد فعال نیست، پذیرنده مشکل خود را به امور مشتریان زرین‌پال ارجاع دهد.',
  '-12':
    'تلاش بیش از دفعات مجاز در یک بازه زمانی کوتاه به امور مشتریان زرین پال اطلاع دهید',
  '-15':
    'درگاه پرداخت به حالت تعلیق در آمده است، پذیرنده مشکل خود را به امور مشتریان زرین‌پال ارجاع دهد.',
  '-16': 'سطح تایید پذیرنده پایین تر از سطح نقره ای است.',
  '-17': 'محدودیت پذیرنده در سطح آبی',
  '100': 'عملیات موفق',
  '-30': 'پذیرنده اجازه دسترسی به سرویس تسویه اشتراکی شناور را ندارد.',
  '-31':
    'حساب بانکی تسویه را به پنل اضافه کنید. مقادیر وارد شده برای تسهیم درست نیست. پذیرنده جهت استفاده از خدمات سرویس تسویه اشتراکی شناور، باید حساب بانکی معتبری به پنل کاربری خود اضافه نماید.',
  '-32': 'مبلغ وارد شده از مبلغ کل تراکنش بیشتر است.',
  '-33': 'درصدهای وارد شده صحیح نیست.',
  '-34': 'مبلغ وارد شده از مبلغ کل تراکنش بیشتر است.',
  '-35': 'تعداد افراد دریافت کننده تسهیم بیش از حد مجاز است.',
  '-36': 'حداقل مبلغ جهت تسهیم باید ۱۰۰۰۰ ریال باشد',
  '-37': 'یک یا چند شماره شبای وارد شده برای تسهیم از سمت بانک غیر فعال است.',
  '-38': 'خطا٬عدم تعریف صحیح شبا٬لطفا دقایقی دیگر تلاش کنید.',
  '-51': 'پرداخت ناموفق',
  '-52':
    'خطای غیر منتظره‌ای رخ داده است. پذیرنده مشکل خود را به امور مشتریان زرین‌پال ارجاع دهد.',
  '101': 'تراکنش وریفای شده است.',
  '-54': 'اتوریتی نامعتبر است.',
  '-50': 'مبلغ پرداخت شده با مقدار مبلغ ارسالی در متد وریفای متفاوت است.',
};

export default class Zarinpal {
  // private
  static api = {
    base: 'https://api.zarinpal.com/pg/v4/payment',
  };
  constructor(private config: Config) {}

  static extraProperties = ['mobile', 'description'];

  static errors = {
    invalidConfig: 'Invalid Configuration',
  };

  async request(
    amount: number,
    extras: ExtraProperties = {}
  ): Promise<{ isOk: boolean; message: string; authority?: string }> {
    const config = this.config;
    const { merchant, callbackUrl } = config;
    const data = {
      merchant_id: merchant,
      amount,
      callback_url: callbackUrl,
      description: extras.description,
      currency: 'IRT',
      metadata: {
        mobile: extras.mobile,
      },
    };
    try {
      const {
        data: { data: response },
      } = await Zarinpal.post('request.json', data);

      let message = errors[String(response.code)] ?? 'با خطا مواجه شده است',
        isOk = false;
      switch (+response?.code) {
        case 100:
          message = 'با موفقیت تایید شد.';
          isOk = true;
          break;
      }
      return {
        ...response,
        isOk,
        message,
      };
    } catch (err) {
      const code = String(err.response?.data?.errors?.code);
      return { isOk: false, message: errors[code] ?? err.message };
    }
  }

  startURL(authority: string) {
    return `https://www.zarinpal.com/pg/StartPay/${authority}`;
  }

  async verify(
    authority: string,
    amount: number
  ): Promise<{ status: PaymentVerifyStatus; message: string }> {
    const { post } = Zarinpal;
    const config = this.config;
    const data = {
      authority,
      merchant_id: config.merchant,
      amount,
    };
    try {
      const {
        data: { data: response },
      } = await post('verify.json', data);
      let message = errors[String(response.code)] ?? 'با خطا مواجه شده است',
        status = PaymentVerifyStatus.Failed;
      switch (+response?.code) {
        case 100:
          message = `با موفقیت تایید شد.`;
          status = PaymentVerifyStatus.Paid;
          break;
        case 101:
          message = `قبلا تایید شده.`;
          status = PaymentVerifyStatus.CheckBefore;
          break;
      }
      return {
        ...response,
        message,
        status,
      };
    } catch (err) {
      const code = String(err.response?.data?.errors?.code);
      if (code === '101')
        return {
          status: PaymentVerifyStatus.CheckBefore,
          message: errors[code],
        };
      return {
        status: PaymentVerifyStatus.Failed,
        message: errors[code] ?? err.message,
      };
    }
  }

  async unverified() {
    const { data } = await Zarinpal.post('unVerified.json', {
      merchant_id: this.config.merchant,
    });
    if (+data.data?.code !== 100) return [];
    const { authorities }: { authorities: any[] } = data.data;

    return authorities.map((data) => ({
      authority: data.authority,
      amount: data.amout,
      currency: data.currency || 'IRT',
    }));
  }

  // private
  static post(path: string, body: any) {
    const { api } = Zarinpal;
    const uri = `${api.base}/${path}`;
    return axios.post(uri, body);
  }
}
