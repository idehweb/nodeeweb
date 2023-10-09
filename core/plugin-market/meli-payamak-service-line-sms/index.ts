import axios, { AxiosRequestConfig } from 'axios';
import { merge } from 'lodash';

import {
  SMSPluginArgs,
  SMSPluginContent,
  SMSPluginResponse,
  SMSPluginResponseRaw,
  SMSPluginSendBulkArgs,
  SmsSendStatus,
} from './type';

type SMSConfig = {
  username: string;
  password: string;
  from: string;
  resolve: (key: string) => any;
};

let config: SMSConfig;

async function sendSMS({ to, type, text }: SMSPluginArgs): SMSPluginResponse {
  if (!config) throw new Error(`need config, which not defined`);

  const configs: AxiosRequestConfig = {
    method: 'POST',
    url: 'http://rest.payamak-panel.com/api/SendSMS/SendSMS',
    data: {
      username: config.username,
      password: config.password,
      from: config.from,
      to: to,
      isflash: 'false',
      text: text,
    },
  };
  const logger = config.resolve('logger');
  const SimpleError = config.resolve('SimpleError');
  const errorParser = config.resolve('axiosError2String');
  try {
    const { data } = await axios(configs);
    if (!(data.Value?.length > 15))
      throw new SimpleError(JSON.stringify(data, null, '  '));
    logger.log(``, data);
    return {
      from: config.from,
      at: new Date(),
      status: SmsSendStatus.Send_Success,
    };
  } catch (err) {
    logger.error(``, errorParser(err, true).message);
    return {
      status: SmsSendStatus.Send_Failed,
      message: errorParser(err, true).message,
      at: new Date(),
      from: config.from,
    };
  }
}

async function sendBulkSMS({
  content,
  type,
  pattern,
}: SMSPluginSendBulkArgs): SMSPluginResponse {
  let response: SMSPluginResponseRaw;
  try {
    for (const con of content) {
      response = await sendSMS({ ...con, type });
      if (response.status === SmsSendStatus.Send_Failed) throw response;
    }
    return response;
  } catch (err) {
    return err;
  }
}
function add(arg: SMSConfig): SMSPluginContent['stack'] {
  config = arg;
  return [sendSMS, sendBulkSMS];
}
function edit(arg: Partial<SMSConfig>): SMSPluginContent['stack'] {
  config = merge(config, arg);
  return [sendSMS, sendBulkSMS];
}

export { add as config, add as active, edit };
