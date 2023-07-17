import smsSendPlugin from '../../plugins/sms-send';
import { registerPlugin } from '../handlers/plugin.handler';

export default function registerDefaultPlugins() {
  const smsPlugin = smsSendPlugin();
  registerPlugin(smsPlugin.type, smsPlugin.content, 'CorePlugin');
}
