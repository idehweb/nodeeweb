import { Logger } from '../../type';
export type ProviderOptions = {
    botToken: string;
    channelId: string;
    providerName: string;
    providerApiKey?: string;
    resolve: (key: string) => any;
    logger: Logger;
};
export default abstract class Provider {
    protected opts: ProviderOptions;
    constructor(opts: ProviderOptions);
    abstract send(message: string): Promise<boolean> | boolean;
}
