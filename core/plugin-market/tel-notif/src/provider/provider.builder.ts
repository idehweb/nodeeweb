import Provider, { ProviderOptions } from './provider.abstract';
import { ProviderType } from '../../type';
import LocalProvider from './local.provider';
import NodeewebProvider from './nodeeweb.provider';

export default class ProviderBuilder {
  provider: Provider;
  static build(type: ProviderType, providerOpts: ProviderOptions): Provider {
    switch (type) {
      case ProviderType.Local:
        return new LocalProvider(providerOpts);
      case ProviderType.Nodeeweb:
        return new NodeewebProvider(providerOpts);
      default:
        throw new Error(`invalid provider type, received: ${type}`);
    }
  }
}
