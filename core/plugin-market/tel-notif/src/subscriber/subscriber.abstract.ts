import Provider from '../provider/provider.abstract';

export type SubscriberOptions = {
  provider: Provider;
};
export default abstract class Subscriber {
  constructor(protected opts: SubscriberOptions) {}
  abstract subscribe(): void;
  abstract unSubscribe(): void;
}
