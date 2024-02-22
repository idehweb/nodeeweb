export interface Logger {
    log(...args: any[]): void;
    error(...args: any[]): void;
}
export declare enum ProviderType {
    Local = "local",
    NodeewebCom = "nodeeweb.com",
    NodeewebIr = "nodeeweb.ir"
}
export interface IConfig {
    botToken: string;
    channelId: string;
    resolve: (key: string) => any;
    providerType: ProviderType;
    apiKey?: string;
}
export interface PluginContent {
    slug: string;
    type: string;
    name: string;
    stack: ((...args: any) => Promise<boolean | any>)[];
}
