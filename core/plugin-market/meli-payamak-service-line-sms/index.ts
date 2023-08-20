import axios, { AxiosRequestConfig } from 'axios';
import {
  SMSPluginArgs,
  SMSPluginContent,
  SmsSendStatus,
  SMSPluginResponse,
  SMSPluginSendBulkArgs,
} from '../../types/plugin';
import logger from '../../src/handlers/log.handler';
import { merge } from 'lodash';

type SMSConfig = {
  username: string;
  password: string;
  from: string;
};

let config: SMSConfig;

async function sendSMS({ to, type, text }: SMSPluginArgs): SMSPluginResponse {
  if (!config)
    throw new Error(`core-sms-plugin need config, which not defined`);

  return {
    from: '5000',
    at: new Date(),
    status: SmsSendStatus.Send_Success,
  };

  const configs: AxiosRequestConfig = {
    method: 'POST',
    url: 'http://rest.payamak-panel.com/api/SendSMS/SendSMS',
    data: {
      username: config.username,
      password: config.password,
      from: config.username,
      to: to,
      isflash: 'false',
      text: text,
    },
  };
  const { data } = await axios(configs);
  logger.log(`[core-sms-send]`, data);
  return {
    from: '5000',
    at: new Date(),
    status: SmsSendStatus.Send_Success,
  };
}

async function sendBulkSMS({
  content,
  type,
  pattern,
}: SMSPluginSendBulkArgs): SMSPluginResponse {
  logger.log(`[core-sms-send]`, { content, type, pattern });
  return {
    from: '5000',
    at: new Date(),
    status: SmsSendStatus.Send_Success,
  };
}
export function add(arg: SMSConfig): SMSPluginContent['stack'] {
  config = arg;
  return [sendSMS, sendBulkSMS];
}
export function edit(arg: Partial<SMSConfig>): SMSPluginContent['stack'] {
  config = merge(config, arg);
  return [sendSMS, sendBulkSMS];
}
