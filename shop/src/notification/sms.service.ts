import store from '@nodeeweb/core/store';
import { NotImplement } from '@nodeeweb/core/types/error';
import {
  CorePluginType,
  SMSPluginArgs,
  SMSPluginContent,
} from '@nodeeweb/core/types/plugin';
import { replaceValue } from '@nodeeweb/core/utils/helpers';

export function sendSms(args: SMSPluginArgs) {
  const smsPlugin = store.plugins.get(CorePluginType.SMS) as SMSPluginContent;
  if (!smsPlugin) throw new NotImplement('sms plugin not found');

  return smsPlugin.stack[0]({
    ...args,
    text: replaceValue({ data: [store.config.toObject()], text: args.text }),
  });
}
