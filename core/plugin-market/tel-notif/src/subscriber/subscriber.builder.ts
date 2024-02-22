import AnalysisSubscriber from './Analysis.subscriber';
import OrderSubscriber from './Order.subscriber';
import { SubscriberOptions } from './subscriber.abstract';

export default class SubscriberBuilder {
  static build(opts: SubscriberOptions) {
    return [new AnalysisSubscriber(opts), new OrderSubscriber(opts)];
  }
}
