import axios, { AxiosRequestConfig } from 'axios';
import {
  Plugin,
  CorePluginType,
  SMSPluginArgs,
  SMSPluginContent,
  SmsSendStatus,
  SMSPluginResponse,
  SMSPluginSendBulkArgs,
} from '../../types/plugin';
import store from '../../store';
import logger from '../../src/handlers/log.handler';

type SMSConfig = {
  username: string;
  password: string;
  from: string;
};

async function sendSMS({ to, type, text }: SMSPluginArgs): SMSPluginResponse {
  const smsConfig = store.config.plugin[CorePluginType.SMS] as SMSConfig;

  if (!smsConfig)
    throw new Error(
      `core-sms-plugin need config.plugin.${CorePluginType.SMS}, which not defined`
    );

  const configs: AxiosRequestConfig = {
    method: 'POST',
    url: 'http://rest.payamak-panel.com/api/SendSMS/SendSMS',
    data: {
      username: smsConfig.username,
      password: smsConfig.password,
      from: smsConfig.username,
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

const smsSendPlugin: Plugin = () => {
  const content: SMSPluginContent = {
    name: '[core-sms-send]',
    stack: [sendSMS, sendBulkSMS],
  };
  return {
    type: CorePluginType.SMS,
    content,
  };
};

export default smsSendPlugin;
