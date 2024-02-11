import Provider from './src/provider/provider.abstract';
import ProviderBuilder from './src/provider/provider.builder';
import { IConfig, PluginContent } from './type';

let config: IConfig & { provider: Provider };

function errorLog(from: string, err: any) {
  const logger = config.resolve('logger');
  const parser = config.resolve('axiosError2String');
  logger.error(`${from} error:`, parser(err));
}

function register(arg: any): PluginContent['stack'] {
  config = arg;
  config.provider = ProviderBuilder.build(config.providerType, {
    botToken: config.botToken,
    channelId: config.channelId,
    providerName: config.providerType,
    providerApiKey: config.apiKey,
  });
  return [];
}

export { register as config, register as active, register as edit };
