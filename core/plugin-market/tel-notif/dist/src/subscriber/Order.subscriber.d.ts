import Subscriber, { SubscriberOptions } from './subscriber.abstract';
export default class OrderSubscriber extends Subscriber {
    constructor(opts: SubscriberOptions);
    onOtherChanges: (order: any) => Promise<void>;
    onNeedToPay: (order: any) => Promise<void>;
    subscribe(): void;
    unSubscribe(): void;
}
