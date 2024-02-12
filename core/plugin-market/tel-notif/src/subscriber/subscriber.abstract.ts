import { Logger } from '../../type';
import Provider from '../provider/provider.abstract';

export type SubscriberOptions = {
  provider: Provider;
  resolve: (key: string) => any;
  logger: Logger;
};
export default abstract class Subscriber {
  constructor(protected opts: SubscriberOptions) {}
  abstract subscribe(): void;
  abstract unSubscribe(): void;
}
