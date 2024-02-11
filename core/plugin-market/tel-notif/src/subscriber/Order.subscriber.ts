import Subscriber from './subscriber.abstract';

export default class OrderSubscriber extends Subscriber {
  subscribe(): void {
    throw new Error('Method not implemented.');
  }
  unSubscribe(): void {
    throw new Error('Method not implemented.');
  }
}
