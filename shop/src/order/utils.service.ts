import { UserDocument } from '@nodeeweb/core/types/auth';
import { OrderDocument, OrderStatus } from '../../schema/order.schema';
import { store } from '@nodeeweb/core';
import {
  CorePluginType,
  SMSPluginContent,
  SMSPluginType,
} from '@nodeeweb/core/types/plugin';
import {
  ORDER_STATUS_CHANGE_MESSAGE,
  TRANSACTION_ON_EXPIRE_MESSAGE,
} from '../../constants/String';

export class Utils {
  get smsPlugin() {
    return store.plugins.get(CorePluginType.SMS) as SMSPluginContent;
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
        break;
      case OrderStatus.Expired:
        orderStatus = 'منقضی شده';
        break;
    }
    const values = {
      '%ORDER_STATUS%': orderStatus,
      '%ORDER_ID%': order._id,
      '%CUSTOMER_FIRST_NAME%': order.customer.firstName,
      '%CUSTOMER_LAST_NAME%': order.customer.lastName,
      ...Object.fromEntries(
        Object.entries(store.env).map(([k, v]) => [`%${k}%`, v])
      ),
    };

    const pattern = /(%[^% ]+%)/g;
    let value = pattern.exec(msg);
    while (value) {
      if (values[value[0]])
        msg = msg.replace(new RegExp(value[0], 'g'), values[value[0]]);
      value = pattern.exec(msg);
    }
    return msg;
  }

  async sendOnStateChange(order: OrderDocument) {
    const message = this.replaceValues(order, ORDER_STATUS_CHANGE_MESSAGE);
    console.log(message);

    if (!this.smsPlugin || !order.customer.phone) return;

    await this.smsPlugin.stack[0]({
      to: order.customer.phone,
      type: SMSPluginType.Reg,
      text: message,
    });
  }
  async sendOnExpire(order: OrderDocument) {
    const message = this.replaceValues(order, TRANSACTION_ON_EXPIRE_MESSAGE);
    console.log(message);

    if (!this.smsPlugin || !order.customer.phone) return;

    await this.smsPlugin.stack[0]({
      to: order.customer.phone,
      type: SMSPluginType.Reg,
      text: message,
    });
  }
}

const utils = new Utils();

export default utils;
