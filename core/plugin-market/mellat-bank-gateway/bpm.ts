import soap from 'soap';
import moment from 'moment';

moment.locale('en');

export class BPM {
  static mellatWsdl = 'https://bpm.shaparak.ir/pgwchannel/services/pgw?wsdl';
  static PgwSite = 'https://bpm.shaparak.ir/pgwchannel/startpay.mellat';
  static mellatBankReturnCode = {
    0: 'ﺗﺮاﻛﻨﺶ_ﺑﺎ_ﻣﻮﻓﻘﻴﺖ_اﻧﺠﺎم_ﺷﺪ',
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
  callbackUrl: string;
  terminalId: number;
  userName: string;
  password: string;

  constructor({
    callbackUrl,
    terminalId,
    username,
    password,
  }: {
    callbackUrl: string;
    terminalId: number;
    username: string;
    password: string;
  }) {
    this.callbackUrl = callbackUrl;
    this.terminalId = terminalId;
    this.userName = username;
    this.password = password;
  }

  desribtionStatusCode(statusCode: number) {
    switch (statusCode) {
      case 0:
        return 'ﺗﺮاﻛﻨﺶ_ﺑﺎ_ﻣﻮﻓﻘﻴﺖ_اﻧﺠﺎم_ﺷﺪ';
      case 11:
        return 'ﺷﻤﺎره_ﻛﺎرت_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
      case 12:
        return 'ﻣﻮﺟﻮدي_ﻛﺎﻓﻲ_ﻧﻴﺴﺖ';
      case 13:
        return 'رﻣﺰ_ﻧﺎدرﺳﺖ_اﺳﺖ';
      case 14:
        return 'ﺗﻌﺪاد_دﻓﻌﺎت_وارد_ﻛﺮدن_رﻣﺰ_ﺑﻴﺶ_از_ﺣﺪ_ﻣﺠﺎز_اﺳﺖ';
      case 15:
        return 'ﻛﺎرت_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
      case 16:
        return 'دﻓﻌﺎت_ﺑﺮداﺷﺖ_وﺟﻪ_ﺑﻴﺶ_از_ﺣﺪ_ﻣﺠﺎز_اﺳﺖ';
      case 17:
        return 'ﻛﺎرﺑﺮ_از_اﻧﺠﺎم_ﺗﺮاﻛﻨﺶ_ﻣﻨﺼﺮف_ﺷﺪه_اﺳﺖ';
      case 18:
        return 'ﺗﺎرﻳﺦ_اﻧﻘﻀﺎي_ﻛﺎرت_ﮔﺬﺷﺘﻪ_اﺳﺖ';
      case 19:
        return 'ﻣﺒﻠﻎ_ﺑﺮداﺷﺖ_وﺟﻪ_ﺑﻴﺶ_از_ﺣﺪ_ﻣﺠﺎز_اﺳﺖ';
      case 111:
        return 'ﺻﺎدر_ﻛﻨﻨﺪه_ﻛﺎرت_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
      case 112:
        return 'ﺧﻄﺎي_ﺳﻮﻳﻴﭻ_ﺻﺎدر_ﻛﻨﻨﺪه_ﻛﺎرت';
      case 113:
        return 'ﭘﺎﺳﺨﻲ_از_ﺻﺎدر_ﻛﻨﻨﺪه_ﻛﺎرت_درﻳﺎﻓﺖ_ﻧﺸﺪ';
      case 114:
        return 'دارﻧﺪه_ﻛﺎرت_ﻣﺠﺎز_ﺑﻪ_اﻧﺠﺎم_اﻳﻦ_ﺗﺮاﻛﻨﺶ_ﻧﻴﺴﺖ';
      case 21:
        return 'ﭘﺬﻳﺮﻧﺪه_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
      case 23:
        return 'ﺧﻄﺎي_اﻣﻨﻴﺘﻲ_رخ_داده_اﺳﺖ';
      case 24:
        return 'اﻃﻼﻋﺎت_ﻛﺎرﺑﺮي_ﭘﺬﻳﺮﻧﺪه_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
      case 25:
        return 'ﻣﺒﻠﻎ_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
      case 31:
        return 'ﭘﺎﺳﺦ_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
      case 32:
        return 'ﻓﺮﻣﺖ_اﻃﻼﻋﺎت_وارد_ﺷﺪه_ﺻﺤﻴﺢ_ﻧﻤﻲ_ﺑﺎﺷﺪ';
      case 33:
        return 'ﺣﺴﺎب_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
      case 34:
        return 'ﺧﻄﺎي_ﺳﻴﺴﺘﻤﻲ';
      case 35:
        return 'ﺗﺎرﻳﺦ_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
      case 41:
        return 'ﺷﻤﺎره_درﺧﻮاﺳﺖ_ﺗﻜﺮاري_اﺳﺖ';
      case 42:
        return 'ﺗﺮاﻛﻨﺶ_Sale_یافت_نشد_';
      case 43:
        return 'ﻗﺒﻼ_Verify_درﺧﻮاﺳﺖ_داده_ﺷﺪه_اﺳﺖ';

      case 44:
        return 'درخواست_verify_یافت_نشد';
      case 45:
        return 'ﺗﺮاﻛﻨﺶ_Settle_ﺷﺪه_اﺳﺖ';
      case 46:
        return 'ﺗﺮاﻛﻨﺶ_Settle_نشده_اﺳﺖ';

      case 47:
        return 'ﺗﺮاﻛﻨﺶ_Settle_یافت_نشد';
      case 48:
        return 'تراکنش_Reverse_شده_است';
      case 49:
        return 'تراکنش_Refund_یافت_نشد';
      case 412:
        return 'شناسه_قبض_نادرست_است';
      case 413:
        return 'ﺷﻨﺎﺳﻪ_ﭘﺮداﺧﺖ_ﻧﺎدرﺳﺖ_اﺳﺖ';
      case 414:
        return 'سازﻣﺎن_ﺻﺎدر_ﻛﻨﻨﺪه_ﻗﺒﺾ_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
      case 415:
        return 'زﻣﺎن_ﺟﻠﺴﻪ_ﻛﺎري_ﺑﻪ_ﭘﺎﻳﺎن_رسیده_است';
      case 416:
        return 'ﺧﻄﺎ_در_ﺛﺒﺖ_اﻃﻼﻋﺎت';
      case 417:
        return 'ﺷﻨﺎﺳﻪ_ﭘﺮداﺧﺖ_ﻛﻨﻨﺪه_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
      case 418:
        return 'اﺷﻜﺎل_در_ﺗﻌﺮﻳﻒ_اﻃﻼﻋﺎت_ﻣﺸﺘﺮي';
      case 419:
        return 'ﺗﻌﺪاد_دﻓﻌﺎت_ورود_اﻃﻼﻋﺎت_از_ﺣﺪ_ﻣﺠﺎز_ﮔﺬﺷﺘﻪ_اﺳﺖ';
      case 421:
        return 'IP_نامعتبر_است';

      case 51:
        return 'ﺗﺮاﻛﻨﺶ_ﺗﻜﺮاري_اﺳﺖ';
      case 54:
        return 'ﺗﺮاﻛﻨﺶ_ﻣﺮﺟﻊ_ﻣﻮﺟﻮد_ﻧﻴﺴﺖ';
      case 55:
        return 'ﺗﺮاﻛﻨﺶ_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
      case 61:
        return 'ﺧﻄﺎ_در_واریز';
    }
    return '';
  }

  async bpPayRequest(
    orderId: number,
    priceAmount: number,
    additionalText?: string
  ) {
    const localDate = moment().format('YYYYMMDD');
    const localTime = moment().format('HHmmss');

    const args = {
      terminalId: this.terminalId,
      userName: this.userName,
      userPassword: this.password,
      orderId,
      amount: priceAmount,
      localDate: localDate,
      localTime: localTime,
      additionalData: additionalText,
      callBackUrl: this.callbackUrl,
      payerId: 0,
    };

    const options = {
      overrideRootElement: {
        namespace: 'ns1',
      },
    };

    try {
      const client = await soap.createClientAsync(BPM.mellatWsdl, options);
      const result = await client.bpPayRequestAsync(args);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async bpVerifyRequest(
    orderId: number,
    saleOrderId: number,
    saleReferenceId: number
  ) {
    const args = {
      terminalId: this.terminalId,
      userName: this.userName,
      userPassword: this.password,
      orderId,
      saleOrderId: saleOrderId,
      saleReferenceId: saleReferenceId,
    };

    const options = {
      overrideRootElement: {
        namespace: 'ns1',
      },
    };

    const client = await soap.createClientAsync(BPM.mellatWsdl, options);
    return await client.bpVerifyRequestAsync(args);
  }

  async bpInquiryRequest(
    orderId: number,
    saleOrderId: number,
    saleReferenceId: number
  ) {
    const args = {
      terminalId: this.terminalId,
      userName: this.userName,
      userPassword: this.password,
      orderId,
      saleOrderId: saleOrderId,
      saleReferenceId: saleReferenceId,
    };

    const options = {
      overrideRootElement: {
        namespace: 'ns1',
      },
    };

    const client = await soap.createClientAsync(BPM.mellatWsdl, options);
    return await client.bpInquiryRequestAsync(args);
  }

  async bpSettleRequest(
    orderId: number,
    saleOrderId: number,
    saleReferenceId: string
  ) {
    const args = {
      terminalId: this.terminalId,
      userName: this.userName,
      userPassword: this.password,
      orderId,
      saleOrderId: saleOrderId,
      saleReferenceId: saleReferenceId,
    };

    const options = {
      overrideRootElement: {
        namespace: 'ns1',
      },
    };

    const client = await soap.createClientAsync(BPM.mellatWsdl, options);
    return await client.bpSettleRequestAsync(args);
  }

  async bpReversalRequest(
    orderId: number,
    saleOrderId: number,
    saleReferenceId: string
  ) {
    const args = {
      terminalId: this.terminalId,
      userName: this.userName,
      userPassword: this.password,
      orderId,
      saleOrderId: saleOrderId,
      saleReferenceId: saleReferenceId,
    };

    const options = {
      overrideRootElement: {
        namespace: 'ns1',
      },
    };

    const client = await soap.createClientAsync(BPM.mellatWsdl, options);
    return await client.bpReversalRequestAsync(args);
  }

  async reversePay(
    orderId: number,
    saleOrderId: number,
    saleReferenceId: string
  ) {
    let resultReversePay = await this.bpReversalRequest(
      orderId,
      saleOrderId,
      saleReferenceId
    );
    resultReversePay = resultReversePay.return;
    console.log(resultReversePay);
  }
}
