import axios, { AxiosRequestConfig } from 'axios';
import {
  Plugin,
  CorePluginType,
  SMSPluginArgs,
  SMSPluginContent,
} from '../../types/plugin';
import store from '../../store';
import { axiosError2String } from '../../utils/helpers';

async function sendSMS({
  to,
  type,
  text,
}: SMSPluginArgs): Promise<boolean | string> {
  const configs: AxiosRequestConfig = {
    method: 'POST',
    url: 'http://rest.payamak-panel.com/api/SendSMS/SendSMS',
    data: {
      username: store.env.SMS_USERNAME,
      password: store.env.SMS_PASSWORD,
      from: store.env.SMS_FROM,
      to: to,
      isflash: 'false',
      text: text,
    },
  };
  const { data } = await axios(configs);
  store.systemLogger.log(`core-sms-send:`, data);
  return true;
}

const smsSendPlugin: Plugin = () => {
  const content: SMSPluginContent = {
    name: 'core-sms-send',
    stack: [sendSMS],
  };
  return {
    type: CorePluginType.SMS,
    content,
  };
};

export default smsSendPlugin;
