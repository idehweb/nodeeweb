export type ProviderOptions = {
  botToken: string;
  channelId: string;
  providerName: string;
  providerApiKey?: string;
  resolve: (key: string) => any;
};
export default abstract class Provider {
  constructor(protected opts: ProviderOptions) {}
  abstract send(message: string): Promise<boolean> | boolean;
}
