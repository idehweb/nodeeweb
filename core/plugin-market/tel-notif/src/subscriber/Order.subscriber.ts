import EventEmitter from 'events';
import Subscriber, { SubscriberOptions } from './subscriber.abstract';

const orderStatus = {
  cart: 'سبد خرید',
  'need-to-pay': 'نیاز به پرداخت',
  paid: 'پرداخت شده',
  posting: 'پست شده',
  completed: 'تکمیل',
  canceled: 'کنسل شده',
  failed: 'خطا خورده',
  expired: 'منقضی شده',
};

function translateOrderStatus(key: string) {
  return orderStatus[key];
}
export default class OrderSubscriber extends Subscriber {
  constructor(opts: SubscriberOptions) {
    super(opts);

    // add serial
    this.onNeedToPay['serial'] = 'tel-notif-subscriber-onNeedToPay';
    this.onOtherChanges['serial'] = 'tel-notif-subscriber-onOtherChanges';
  }
  onOtherChanges = async (order: any) => {
    try {
      if (
        ![
          'paid',
          'posting',
          'completed',
          'canceled',
          'failed',
          'expired',
        ].includes(order.status)
      )
        return;
      const store = this.opts.resolve('store');

      const title = '<b>تغییر وضعیت سفارش</b>';

      const tuples: [string, string][] = [];

      // order id
      tuples.push(['شماره سفارش', order._id]);

      // order status
      tuples.push(['وضعیت سفارش', translateOrderStatus(order.status)]);

      // price
      tuples.push([
        'مبلغ',
        `${new Intl.NumberFormat('fa-IR').format(order.totalPrice)} ${
          order.currency
        }`,
      ]);

      // customer name
      if (order.customer.firstName || order.customer.lastName)
        tuples.push([
          'نام و نام خانوادگی مشتری',
          [order.customer.firstName, order.customer.lastName]
            .filter((n) => n)
            .join(' '),
        ]);

      // customer phone
      if (order.customer.phone)
        tuples.push(['شماره تماس مشتری', order.customer.phone]);

      // gateway
      if (order.transactions?.length) {
        const t = order.transactions[order.transactions.length - 1];
        tuples.push(['درگاه', t.provider]);
      }

      // footer
      const footer = `<a href="${store.config.host}/admin/#/order/${order._id}">پنل ادمین</a>`;

      // combine
      const msg = `${title}\n${tuples
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n')}\n${footer}`;

      // send
      await this.opts.provider.send(msg);
    } catch (err) {
      this.opts.logger.error('[order-subscriber] error in onOtherChange', err);
    }
  };
  onNeedToPay = async (order: any) => {
    try {
      if (order.status !== 'need-to-pay') return;

      const store = this.opts.resolve('store');

      const title = '<b>ثبت سفارش</b>';

      const tuples: [string, string][] = [];

      // order id
      tuples.push(['شماره سفارش', order._id]);

      // price
      tuples.push([
        'مبلغ',
        `${new Intl.NumberFormat('fa-IR').format(order.totalPrice)} ${
          order.currency
        }`,
      ]);

      // customer name
      if (order.customer.firstName || order.customer.lastName)
        tuples.push([
          'نام و نام خانوادگی مشتری',
          [order.customer.firstName, order.customer.lastName]
            .filter((n) => n)
            .join(' '),
        ]);

      // customer phone
      if (order.customer.phone)
        tuples.push(['شماره تماس مشتری', order.customer.phone]);

      // products
      tuples.push([
        'اقلام',
        order.products
          .map((p, i) => `${i + 1}. ${Object.values(p.title)[0]}`)
          .join('\n'),
      ]);

      // footer
      const footer = `<a href="${store.config.host}/admin/#/order/${order._id}">پنل ادمین</a>`;

      // combine
      const msg = `${title}\n${tuples
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n')}\n${footer}`;

      // send
      await this.opts.provider.send(msg);
    } catch (err) {
      this.opts.logger.error('[order-subscriber] error in onNeedToPay', err);
    }
  };
  subscribe(): void {
    const store = this.opts.resolve('store');

    // register listeners
    store.event.on('post-updateOne-order', this.onNeedToPay);
    store.event.on('post-updateOne-order', this.onOtherChanges);
  }
  unSubscribe(): void {
    const store = this.opts.resolve('store');
    const event: EventEmitter = store.event;

    // unregister
    event.removeListener('post-updateOne-order', this.onNeedToPay);
    event.removeListener('post-updateOne-order', this.onOtherChanges);
  }
}
