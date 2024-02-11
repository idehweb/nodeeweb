import { IConfig, PluginContent } from './type';

let config: IConfig;

function errorLog(from: string, err: any) {
  const logger = config.resolve('logger');
  const parser = config.resolve('axiosError2String');
  logger.error(`${from} error:`, parser(err));
}

function register(arg: any): PluginContent['stack'] {
  config = arg;
  return [];
}

export { register as config, register as active, register as edit };
