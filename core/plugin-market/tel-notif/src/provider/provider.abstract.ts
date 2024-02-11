export type ProviderOptions = {
  botToken: string;
  channelId: string;
  providerName: string;
  providerApiKey?: string;
};
export default abstract class Provider {
  constructor(protected opts: ProviderOptions) {}
  abstract send(message: string): Promise<boolean> | boolean;
}
