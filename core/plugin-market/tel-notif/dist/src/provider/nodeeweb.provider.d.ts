import Provider, { ProviderOptions } from './provider.abstract';
export default class NodeewebProvider extends Provider {
    private api;
    constructor(opt: ProviderOptions);
    send(message: string): Promise<boolean>;
}
