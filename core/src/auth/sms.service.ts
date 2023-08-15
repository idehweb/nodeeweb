import store from '../../store';
import { NotImplement } from '../../types/error';
import {
  CorePluginType,
  SMSPluginArgs,
  SMSPluginContent,
} from '../../types/plugin';
import { replaceValue } from '../../utils/helpers';

export function sendSms(args: SMSPluginArgs) {
  const smsPlugin = store.plugins.get(CorePluginType.SMS) as SMSPluginContent;
  if (!smsPlugin) throw new NotImplement('sms plugin not found');

  return smsPlugin.stack[0]({
    ...args,
    text: replaceValue({ data: [store.config.toObject()], text: args.text }),
  });
}
