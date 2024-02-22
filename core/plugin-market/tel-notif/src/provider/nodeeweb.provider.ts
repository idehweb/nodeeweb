import axios, { Axios } from 'axios';
import Provider, { ProviderOptions } from './provider.abstract';

export default class NodeewebProvider extends Provider {
  private api: Axios;
  constructor(opt: ProviderOptions) {
    super(opt);
    this.api = axios.create({
      baseURL: 'https://telbot.nodeeweb.com',
      headers: {
        'X-Auth-From': opt.providerName,
        Authorization: `Bearer ${this.opts.providerApiKey}`,
      },
    });
  }
  async send(message: string): Promise<boolean> {
    try {
      await this.api.post('/message', {
        message,
        botToken: this.opts.botToken,
        channelId: this.opts.channelId,
        parse_mode: 'HTML',
      });
    } catch (err) {
      this.opts.logger.error(
        'nodeeweb provider error',
        err.message,
        err?.response?.data
      );
      return false;
    }
  }
}
