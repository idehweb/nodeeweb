import smsSendPlugin from '../../plugins/sms-send';
import logger from '../handlers/log.handler';
import { registerPlugin } from '../handlers/plugin.handler';

export default function registerDefaultPlugins() {
  const smsPlugin = smsSendPlugin();
  registerPlugin(smsPlugin.type, smsPlugin.content, {
    from: 'CorePlugin',
    logger,
  });
}
