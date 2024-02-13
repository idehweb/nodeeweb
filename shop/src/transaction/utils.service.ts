import { isEnum } from 'class-validator';
import {
  ITransactionGrid,
  TransactionDocument,
  TransactionModel,
  TransactionStatus,
} from '../../schema/transaction.schema';
import { PaymentVerifyStatus } from '../../types/order';
import { OrderStatus } from '../../schema/order.schema';
import store from '../../store';

class TransactionUtils {
  get model(): TransactionModel {
    return store.db.model('transaction');
  }
  convertTransaction2Grid(
    transaction: TransactionDocument | any
  ): ITransactionGrid {
    return {
      _id: transaction._id,
      amount: transaction.amount,
      status: transaction.status,
      provider: transaction.provider,
      payment_link: transaction.payment_link,
      payment_body: transaction.payment_body,
      payment_headers: transaction.payment_headers,
      payment_method: transaction.payment_method,
      payment_message: transaction.payment_message,
      createdAt: transaction.createdAt,
      expiredAt: transaction.expiredAt,
    };
  }

  convertStatus(status: any): TransactionStatus {
    if (isEnum(status, TransactionStatus)) return status;
    switch (status) {
      case PaymentVerifyStatus.CheckBefore:
      case PaymentVerifyStatus.Paid:
        return TransactionStatus.Paid;

      case PaymentVerifyStatus.Failed:
        return TransactionStatus.Failed;

      case OrderStatus.NeedToPay:
        return TransactionStatus.NeedToPay;

      case OrderStatus.Paid:
      case OrderStatus.Completed:
      case OrderStatus.Posting:
        return TransactionStatus.Paid;

      case OrderStatus.Canceled:
        return TransactionStatus.Canceled;

      case OrderStatus.Failed:
        return TransactionStatus.Failed;

      case OrderStatus.Expired:
        return TransactionStatus.Expired;

      default:
        throw new Error(
          `can not convert ${status} into TransactionStatus with any strategy`
        );
    }
  }

  combineStatuses(...statusArr: any[]): TransactionStatus {
    const convertedStatus = statusArr.filter((s) => s).map(this.convertStatus);
    return convertedStatus.reduce((prev, curr) => {
      if (!prev) return curr;

      if (prev === TransactionStatus.Failed) {
        return curr;
      }
      return prev;
    }, null);
  }
  async cancel(transaction: ITransactionGrid) {
    await this.model.findOneAndUpdate(
      {
        _id: transaction._id,
        active: true,
        status: TransactionStatus.NeedToPay,
      },
      { $set: { status: TransactionStatus.Canceled, active: false } }
    );
  }
}

export default new TransactionUtils();
