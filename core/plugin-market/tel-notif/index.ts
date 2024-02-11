import Provider from './src/provider/provider.abstract';
import ProviderBuilder from './src/provider/provider.builder';
import Subscriber from './src/subscriber/subscriber.abstract';
import SubscriberBuilder from './src/subscriber/subscriber.builder';
import { IConfig, PluginContent } from './type';

let config: IConfig & { provider: Provider; subscribers?: Subscriber[] };

function errorLog(from: string, err: any) {
  const logger = config.resolve('logger');
  const parser = config.resolve('axiosError2String');
  logger.error(`${from} error:`, parser(err));
}

function register(arg: any): PluginContent['stack'] {
  const subscribers = config.subscribers;

  // unsubscribe
  if (subscribers) subscribers.forEach((sub) => sub.unSubscribe());

  config = arg;

  // init provider
  config.provider = ProviderBuilder.build(config.providerType, {
    botToken: config.botToken,
    channelId: config.channelId,
    providerName: config.providerType,
    providerApiKey: config.apiKey,
  });

  // init subscribers
  if (subscribers) {
    config.subscribers = subscribers;
  } else {
    config.subscribers = SubscriberBuilder.build({ provider: config.provider });
  }
  subscribers.forEach((sub) => sub.subscribe());

  return [];
}

export { register as config, register as active, register as edit };
