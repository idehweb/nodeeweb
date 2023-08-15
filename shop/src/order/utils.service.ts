import { OrderDocument, OrderStatus } from '../../schema/order.schema';
import {
  CorePluginType,
  SMSPluginContent,
  SMSPluginType,
} from '@nodeeweb/core/types/plugin';
import { replaceValue } from '@nodeeweb/core/utils/helpers';
import store from '../../store';
import { SmsSubType } from '../../types/sms';

export class Utils {
  get smsPlugin() {
    return store.plugins.get(CorePluginType.SMS) as SMSPluginContent;
  }

  private orderStatus2Msg(orderStatus: OrderStatus) {
    const msgs = store.config.sms_message_on;

    switch (orderStatus) {
      case OrderStatus.Paid:
        return msgs.paid_order;
      case OrderStatus.Posting:
        return msgs.post_order;
      case OrderStatus.Completed:
        return msgs.complete_order;
      case OrderStatus.Canceled:
        return msgs.cancel_order;
      default:
        throw new Error(`unexpected value for order status, ${orderStatus}`);
    }
  }

  private replaceValues(order: OrderDocument, msg: string) {
    let orderStatus: string;
    switch (order.status) {
      case OrderStatus.Cart:
        orderStatus = 'سبد خرید';
        break;
      case OrderStatus.NeedToPay:
        orderStatus = 'نیاز به پرداخت';
        break;
      case OrderStatus.Posting:
        orderStatus = 'در حال پست';
        break;
      case OrderStatus.Completed:
        orderStatus = 'تحویل داده شده';
        break;
      case OrderStatus.Canceled:
        orderStatus = 'کنسل شده';
        break;
      case OrderStatus.Expired:
        orderStatus = 'منقضی شده';
        break;
    }
    return replaceValue({
      data: [
        store.config.toObject(),
        {
          ORDER_STATUS: orderStatus,
          ORDER_ID: order._id,
          CUSTOMER_FIRST_NAME: order.customer.firstName,
          CUSTOMER_LAST_NAME: order.customer.lastName,
        },
      ],
      text: msg,
    });
  }

  async sendOnStateChange(order: OrderDocument) {
    const message = this.replaceValues(
      order,
      this.orderStatus2Msg(order.status)
    );

    if (!this.smsPlugin || !order.customer.phone) return;

    await this.smsPlugin.stack[0]({
      to: order.customer.phone,
      type: SMSPluginType.Automatic,
      subType: SmsSubType.OrderStatus,
      text: message,
    });
  }
  async sendOnExpire(order: OrderDocument) {
    const message = this.replaceValues(
      order,
      store.config.sms_message_on.approach_transaction_expiration
    );

    if (!this.smsPlugin || !order.customer.phone) return;

    await this.smsPlugin.stack[0]({
      to: order.customer.phone,
      type: SMSPluginType.Automatic,
      subType: SmsSubType.ApproachTransactionExp,
      text: message,
    });
  }
}

const utils = new Utils();

export default utils;
