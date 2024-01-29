import { Provider } from './provider.abstract';
import { Provider as ProviderType } from '../../type';
import { NodeewebComProvider, NodeewebIrProvider } from './nodeeweb.provider';
import { OpenAIProvider } from './openai.provider';

export class ProviderBuilder {
  provider: Provider;
  static build(type: ProviderType, apiKey: string, model = 'gpt-4'): Provider {
    switch (type) {
      case ProviderType.NodeewebCom:
        return new NodeewebComProvider(apiKey, model);
      case ProviderType.NodeewebIr:
        return new NodeewebIrProvider(apiKey, model);
      case ProviderType.OpenAI:
        return new OpenAIProvider(apiKey, model);
      default:
        throw new Error(`invalid provider type, received: ${type}`);
    }
  }
}
