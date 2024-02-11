export type ProviderOptions = {
  botToken: string;
  channelId: string;
  providerName: string;
  providerApiKey?: string;
};
export default abstract class Provider {
  constructor(protected opts: ProviderOptions) {}
  protected abstract send(message: string): Promise<boolean> | boolean;
}
