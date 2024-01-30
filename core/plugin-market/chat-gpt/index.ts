import { Provider } from './src/provider/provider.abstract';
import { ProviderBuilder } from './src/provider/provider.builder';
import { ChatGptPluginContent, Provider as ProviderType } from './type';

let config: {
  providerType: ProviderType;
  apiKey: string;
  model?: string;
  provider: Provider;
  resolve: (key: string) => any;
};

function errorLog(from: string, err: any) {
  const logger = config.resolve('logger');
  const parser = config.resolve('axiosError2String');
  logger.error(`${from} error:`, parser(err));
}

const prompt: ChatGptPluginContent['stack'][0] = async ({ q, model }) => {
  try {
    const response = await config.provider.prompt(q, model);
    return {
      isOk: true,
      message: response.answer,
    };
  } catch (err) {
    errorLog('prompt', err);
    return { isOk: false, message: err.message };
  }
};

const promptController = async (req: any, res: any) => {
  const body = req.body;
  const response = await prompt(body);
  if (response.isOk)
    return res.status(200).json({ data: { answer: response.message } });
  else return res.status(400).json({ message: response.message });
};

function register(arg: any): ChatGptPluginContent['stack'] {
  config = arg;
  config.providerType = arg.provider;
  config.provider = ProviderBuilder.build(
    config.providerType,
    config.apiKey,
    config.model
  );

  // register controller
  const controllerRegister = config.resolve('controllerRegister');
  controllerRegister(
    {
      method: 'post',
      service: promptController,
      url: '/prompt',
    },
    { from: 'ChatGptPlugin', base_url: '/api/v1/chat-gpt' }
  );

  return [prompt];
}

export { register as config, register as active, register as edit };
