import { NotifLogger } from './src/logger';
import Provider from './src/provider/provider.abstract';
import ProviderBuilder from './src/provider/provider.builder';
import Subscriber from './src/subscriber/subscriber.abstract';
import SubscriberBuilder from './src/subscriber/subscriber.builder';
import { IConfig, PluginContent } from './type';

let config: IConfig & { provider: Provider; subscribers?: Subscriber[] };

function register(arg: any): PluginContent['stack'] {
  const subscribers = config?.subscribers;

  // unsubscribe
  if (subscribers) subscribers.forEach((sub) => sub.unSubscribe());

  config = arg;

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
    config.subscribers = subscribers;
  } else {
    config.subscribers = SubscriberBuilder.build({
      provider: config.provider,
      resolve: config.resolve,
      logger,
    });
  }
  config.subscribers.forEach((sub) => sub.subscribe());

  return [];
}

export { register as config, register as active, register as edit };
