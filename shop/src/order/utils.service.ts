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
  TransactionModel,
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
  exec?: boolean;
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
  get transactionModel() {
    return store.db.model('transaction') as TransactionModel;
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

  private replaceValues(order: OrderDocument | IOrder, msg: string) {
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

  async sendOnStateChange(order: OrderDocument | IOrder) {
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
    trsSts: TransactionDocument | TransactionStatus,
    update: UpdateQuery<OrderDocument>
  ) {
    const transaction = typeof trsSts === 'string' ? null : trsSts;
    const status = typeof trsSts === 'string' ? trsSts : transaction.status;

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
      switch (status) {
        case TransactionStatus.Paid:
          // paid
          if (transaction) {
            const left =
              order.totalPrice -
              order.transactions
                .filter((t) => t.status === TransactionStatus.Paid)
                .reduce((acc, t) => acc + t.amount, 0);
            if (left - transaction.amount <= 0) {
              update.$set.status = OrderStatus.Paid;
              isOrderPaid = true;
            }
          } else {
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
  private isInstanceOf(a: any, b: any) {
    return a instanceof b || b?.modelName === a.modelName;
  }
  async updateOrder(
    transaction: TransactionDocument,
    opt?: UpdateOrderOpt
  ): Promise<UpdateQuery<OrderDocument>>;
  async updateOrder(
    order: OrderDocument,
    newStatus: TransactionStatus,
    opt?: UpdateOrderOpt
  ): Promise<UpdateQuery<OrderDocument>>;
  async updateOrder(
    trsOrd: TransactionDocument | OrderDocument,
    stsOpt: TransactionStatus | UpdateOrderOpt = {},
    opt: UpdateOrderOpt = {}
  ) {
    // initialize
    const order = this.isInstanceOf(trsOrd, this.orderModel)
      ? (trsOrd as OrderDocument)
      : null;
    const transaction = this.isInstanceOf(trsOrd, this.transactionModel)
      ? (trsOrd as TransactionDocument)
      : null;
    const newStatus = typeof stsOpt === 'string' ? stsOpt : null;
    const options = merge<UpdateOrderOpt, UpdateOrderOpt, UpdateOrderOpt>(
      {},
      {
        pushTransaction: false,
        sendSuccessSMS: false,
        updateStatus: false,
        exec: true,
      },
      typeof stsOpt !== 'string' ? stsOpt : opt
    );
    let isOrderPaid = false;
    const update: UpdateQuery<OrderDocument> = { $set: {}, $push: {} };
    const _updateWithTransaction = async () => {
      const order = await this.orderModel.findById(transaction.order);
      if (!order) return;

      // push transaction
      if (options.pushTransaction) {
        update.$push.transactions =
          transactionUtils.convertTransaction2Grid(transaction);
      }

      // update status
      if (options.updateStatus) {
        const result = await this.updateOrderStatus(order, transaction, update);
        isOrderPaid = result.isOrderPaid;

        if (!options.pushTransaction) {
          const trIndex = order.transactions.findIndex((t) =>
            t._id.equals(transaction._id)
          );
          // update transaction
          if (trIndex !== -1) {
            update.$set[`transactions.${trIndex}`] =
              transactionUtils.convertTransaction2Grid(transaction);
          }
        }
      }

      // send sms
      if (options.sendSuccessSMS && isOrderPaid) {
        utils
          .sendOnStateChange({ ...order.toObject(), status: OrderStatus.Paid })
          ?.then();
      }

      // execute
      if (options.exec) {
        await this.orderModel.updateOne({ _id: order._id }, update);
      }

      return update;
    };

    const _updateWithNewStatus = async () => {
      // update status
      if (options.updateStatus) {
        const result = await this.updateOrderStatus(order, newStatus, update);
        isOrderPaid = result.isOrderPaid;
      }

      // send sms
      if (options.sendSuccessSMS && isOrderPaid) {
        utils.sendOnStateChange(order)?.then();
      }

      // execute
      if (options.exec)
        await this.orderModel.updateOne({ _id: order._id }, update);

      return update;
    };

    if (transaction) return await _updateWithTransaction();
    if (order && newStatus) return await _updateWithNewStatus();
  }
}

const utils = new Utils();

export default utils;
