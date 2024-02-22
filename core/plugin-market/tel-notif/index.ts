import { NotifLogger } from './src/logger';
import Provider from './src/provider/provider.abstract';
import ProviderBuilder from './src/provider/provider.builder';
import Subscriber from './src/subscriber/subscriber.abstract';
import SubscriberBuilder from './src/subscriber/subscriber.builder';
import { IConfig, PluginContent } from './type';

let config: IConfig & { provider: Provider };
const staticConf = {
  get subscribers(): Subscriber[] {
    return config.resolve('store')['tel-notif-subscribers'];
  },
  set subscribers(value: Subscriber[]) {
    config.resolve('store')['tel-notif-subscribers'] = value;
  },
};

function register(arg: any): PluginContent['stack'] {
  config = arg;

  const subscribers = staticConf.subscribers;

  // unsubscribe
  if (subscribers) subscribers.forEach((sub) => sub.unSubscribe());

  const logger = new NotifLogger(config.resolve);

  // init provider
  config.provider = ProviderBuilder.build(config.providerType, {
    botToken: config.botToken,
    channelId: config.channelId,
    providerName: config.providerType,
    providerApiKey: config.apiKey,
    resolve: config.resolve,
    logger,
  });

  // init subscribers
  if (subscribers) {
    staticConf.subscribers = subscribers;
  } else {
    staticConf.subscribers = SubscriberBuilder.build({
      provider: config.provider,
      resolve: config.resolve,
      logger,
    });
  }
  staticConf.subscribers.forEach((sub) => sub.subscribe());

  return [];
}

export { register as config, register as active, register as edit };
