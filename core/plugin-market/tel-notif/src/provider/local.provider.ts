import { Telegraf } from 'telegraf';
import Provider, { ProviderOptions } from './provider.abstract';

export default class LocalProvider extends Provider {
  private bot: Telegraf;
  constructor(opt: ProviderOptions) {
    super(opt);
    this.bot = new Telegraf(opt.botToken);
  }

  async send(message: string): Promise<boolean> {
    try {
      await this.bot.telegram.sendMessage(this.opts.channelId, message, {
        parse_mode: 'HTML',
      });
      return true;
    } catch (err) {
      this.opts.logger.error('local provider error', err.message);
      return false;
    }
  }
}
