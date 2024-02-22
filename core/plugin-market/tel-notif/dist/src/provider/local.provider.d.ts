import Provider, { ProviderOptions } from './provider.abstract';
export default class LocalProvider extends Provider {
    private bot;
    constructor(opt: ProviderOptions);
    send(message: string): Promise<boolean>;
}
