import Provider from './provider.abstract';

export default class LocalProvider extends Provider {
  send(message: string): boolean | Promise<boolean> {
    return true;
  }
}
