export interface IConfig {
  botToken: string;
  channelId: string;
  resolve: (key: string) => any;
  provider: 'local' | 'nodeeweb';
  apiKey?: string;
}

export interface PluginContent {
  slug: string;
  type: string;
  name: string;
  stack: ((...args: any) => Promise<boolean | any>)[];
}
