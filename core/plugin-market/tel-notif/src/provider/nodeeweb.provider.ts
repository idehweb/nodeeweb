import Provider from './provider.abstract';

export default class NodeewebProvider extends Provider {
  send(message: string): boolean | Promise<boolean> {
    return true;
  }
}
