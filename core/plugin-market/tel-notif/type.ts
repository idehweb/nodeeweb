export enum ProviderType {
  Local = 'local',
  Nodeeweb = 'nodeeweb',
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
