import Provider from './provider.abstract';

export default class LocalProvider extends Provider {
  send(message: string): boolean | Promise<boolean> {
    this.opts.logger.log('we got', message);
    return true;
  }
}
