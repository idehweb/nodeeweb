import Provider, { ProviderOptions } from './provider.abstract';
import { ProviderType } from '../../type';
export default class ProviderBuilder {
    provider: Provider;
    static build(type: ProviderType, providerOpts: ProviderOptions): Provider;
}
