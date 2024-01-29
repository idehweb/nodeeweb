import { Provider } from './provider.abstract';
import { Provider as ProviderType } from '../../type';
export declare class ProviderBuilder {
    provider: Provider;
    static build(type: ProviderType, apiKey: string, model?: string): Provider;
}
