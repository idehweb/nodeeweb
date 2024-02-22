import { Logger } from '../../type';
import Provider from '../provider/provider.abstract';
export type SubscriberOptions = {
    provider: Provider;
    resolve: (key: string) => any;
    logger: Logger;
};
export default abstract class Subscriber {
    protected opts: SubscriberOptions;
    constructor(opts: SubscriberOptions);
    abstract subscribe(): void;
    abstract unSubscribe(): void;
}
