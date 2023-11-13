import {
  IOrder,
  OrderDocument,
  OrderModel,
  OrderStatus,
} from '../../schema/order.schema';
import {
  CorePluginType,
  SMSPluginContent,
  SMSPluginType,
} from '@nodeeweb/core/types/plugin';
import { replaceValue } from '@nodeeweb/core/utils/helpers';
import store from '../../store';
import { SmsSubType } from '../../types/sms';
import {
  TransactionDocument,
  TransactionStatus,
} from '../../schema/transaction.schema';
import { PostGatewayPluginContent, ShopPluginType } from '../../types/plugin';
import { ProductModel } from '../../schema/product.schema';
import { DiscountModel } from '../../schema/discount.schema';
import { merge } from 'lodash';
import { UpdateQuery } from 'mongoose';
import transactionUtils from '../transaction/utils.service';

export type UpdateOrderOpt = {
  sendSuccessSMS?: boolean;
  pushTransaction?: boolean;
  updateStatus?: boolean;
};
export class Utils {
  get smsPlugin() {
    return store.plugins.get(CorePluginType.SMS) as SMSPluginContent;
  }

  get postPlugin() {
    const postPlugin = store.plugins.get(
      ShopPluginType.POST_GATEWAY
    ) as PostGatewayPluginContent;
    return postPlugin;
  }

  get orderModel() {
    return store.db.model('order') as OrderModel;
  }
  get productModel() {
    return store.db.model('product') as ProductModel;
  }
  get discountModel() {
    return store.db.model('discount') as DiscountModel;
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

  private submitPostReq(order: OrderDocument): Promise<IOrder['post']> {
    if (!this.postPlugin) return;

    return this.postPlugin.stack[1]({
      address: order.address,
      products: order.products.flatMap((p) => p.combinations),
    });
  }

  private async updateOrderStatus(
    order: OrderDocument,
    transaction: TransactionDocument,
    update: UpdateQuery<OrderDocument>
  ) {
    let isOrderPaid = false;
    const _rollback = async () => {
      // rollback
      // disabled order
      order = await this.orderModel.findOneAndUpdate(
        { _id: order._id },
        {
          $set: { active: false, status: OrderStatus.Canceled },
        },
        { new: true }
      );

      // rollback products
      await this.productModel.bulkWrite(
        order.products.flatMap((p) =>
          p.combinations.map((d) => ({
            updateOne: {
              filter: { _id: p._id, 'combinations._id': d._id },
              update: { $inc: { 'combinations.$.quantity': d.quantity } },
            },
          }))
        ),
        { ordered: false }
      );

      // pull discount consumer
      if (order.discount) {
        await this.discountModel.updateOne(
          { code: order.discount.code },
          { $pull: { consumers: order.customer._id }, $inc: { usageLimit: 1 } }
        );
      }
    };
    if (order.status === OrderStatus.NeedToPay && order.active) {
      switch (transaction.status) {
        case TransactionStatus.Paid:
          // paid
          const left =
            order.totalPrice -
            order.transactions.reduce((acc, t) => acc + t.amount, 0);
          if (left - transaction.amount <= 0) {
            update.$set.status = OrderStatus.Paid;
            isOrderPaid = true;
          }
          break;
        case TransactionStatus.Canceled:
          update.$set.status = OrderStatus.Canceled;
          await _rollback();
          break;
        case TransactionStatus.Failed:
          update.$set.status = OrderStatus.Failed;
          await _rollback();
          break;
        case TransactionStatus.Expired:
          update.$set.status = OrderStatus.Expired;
          await _rollback();
          break;

        default:
          break;
      }
    }
    return { isOrderPaid, update };
  }

  async updateOrder(
    transaction: TransactionDocument,
    opt: UpdateOrderOpt = {}
  ) {
    const options = merge<UpdateOrderOpt, UpdateOrderOpt, UpdateOrderOpt>(
      {},
      { pushTransaction: false, sendSuccessSMS: false, updateStatus: false },
      opt
    );
    let isOrderPaid = false;

    const order = await this.orderModel.findById(transaction.order);
    if (!order) return;

    const update: UpdateQuery<OrderDocument> = { $set: {}, $push: {} };

    // push transaction
    if (options.pushTransaction) {
      update.$push.transactions =
        transactionUtils.convertTransaction2Grid(transaction);
    }

    // update status
    if (options.updateStatus) {
      const result = await this.updateOrderStatus(order, transaction, update);
      isOrderPaid = result.isOrderPaid;
    }

    // send sms
    if (options.sendSuccessSMS && isOrderPaid) {
      utils.sendOnStateChange(order)?.then();
    }

    // execute
    await this.orderModel.updateOne({ _id: order._id }, update);
  }
}

const utils = new Utils();

export default utils;
