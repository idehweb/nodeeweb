import {
  BadRequestError,
  ErrorType,
  GeneralError,
  LimitError,
  MiddleWare,
  NotFound,
  NotImplement,
} from '@nodeeweb/core';
import {
  OrderDocument,
  OrderModel,
  OrderStatus,
} from '../../schema/order.schema';
import { ProductDocument, ProductModel } from '../../schema/product.schema';
import mongoose, { FilterQuery, Types, UpdateQuery } from 'mongoose';
import { PaymentVerifyStatus } from '../../types/order';
import {
  BankGatewayPluginContent,
  BankGatewayVerifyArgs,
  ShopPluginType,
} from '../../types/plugin';
import logger from '../../utils/log';
import { axiosError2String } from '@nodeeweb/core/utils/helpers';
import store from '../../store';
import {
  ITransaction,
  TransactionCreator,
  TransactionDocument,
  TransactionModel,
  TransactionProvider,
  TransactionStatus,
} from '../../schema/transaction.schema';
import { UserDocument } from '@nodeeweb/core/types/user';
import orderUtils from '../order/utils.service';
import utilsService from './utils.service';
import { HandlePaymentArgs } from '../../types/transaction';

class PaymentService {
  transactionSupervisors = new Map<string, NodeJS.Timer>();

  get transactionModel() {
    return store.db.model('transaction') as TransactionModel;
  }
  get orderModel() {
    return store.db.model('order') as OrderModel;
  }
  get productModel() {
    return store.db.model('product') as ProductModel;
  }

  private async getNeedToPayTransactions(
    filter: FilterQuery<ITransaction>,
    throwOnError = true
  ) {
    const transaction = await this.transactionModel.findOne({
      ...filter,
      active: true,
      status: TransactionStatus.NeedToPay,
    });
    if (!transaction && throwOnError)
      throw new NotFound('transaction not found');
    return transaction;
  }

  createTransaction = async ({
    order,
    user,
    amount,
    pluginSlug,
  }: {
    order: OrderDocument;
    user: UserDocument;
    amount: number;
    pluginSlug?: string;
  }) => {
    // 0. check shop available
    if (!store.config.shop_active)
      throw new GeneralError(
        store.config.shop_inactive_message,
        503,
        ErrorType.Unavailable
      );

    // 1. check user maximum need paid transaction
    const needToPayOrders = await this.transactionModel
      .find({
        'payer._id': user._id,
        status: TransactionStatus.NeedToPay,
        active: true,
      })
      .count();

    if (needToPayOrders > store.config.limit.max_need_to_pay_transaction)
      throw new LimitError(
        'Maximum need to pay transaction , please paid them first'
      );

    const transactionId = new mongoose.Types.ObjectId();
    // 2. create payment link
    const payment = await this.createPaymentLink(
      transactionId.toString(),
      amount,
      order.products,
      user.phone,
      pluginSlug
    );

    // 3. create transaction doc
    const transaction = await this.transactionModel.create({
      ...payment,
      _id: transactionId,
      amount,
      payer: { _id: user._id, type: user.type },
      currency: store.config.currency,
      order: order._id,
      creator_category: TransactionCreator.Customer_Order,
    });

    // 3. active supervisor
    await this.transactionSupervisor(transaction, order, {
      clear: true,
      expired_watcher: amount ? true : false,
      notif_watcher: amount ? true : false,
      watchers_timeout:
        payment.expiredAt && payment.expiredAt.getTime() - Date.now(),
    });

    return transaction;
  };

  paymentCallback: MiddleWare = async (req, res) => {
    // handle payment
    const transaction = await this.transactionModel.findOne({
      _id: req.params.transactionId,
      active: true,
    });

    const { status } = await this.handlePayment({
      transaction,
      failedAction: true,
      successAction: true,
      extraFields: { ...req.query, ...req.body },
    });

    // redirect
    return res.redirect(
      `${store.config.payment_redirect}?${[
        transaction.order && `order_id=${transaction.order.toString()}`,
        `transaction_id=${transaction._id.toString()}`,
        `status=${status}`,
      ]
        .filter((k) => k)
        .join('&')}`
    );
  };

  private async createPaymentLink(
    transactionId: string,
    amount: number,
    products: ProductDocument[] | OrderDocument['products'],
    userPhone: string,
    pluginSlug?: string
  ): Promise<{
    authority: string;
    provider: string;
    payment_link?: string;
    payment_method: string;
    payment_headers?: { [key: string]: string };
    payment_body?: any;
    payment_message?: string;
    expiredAt?: Date;
  }> {
    const bankPlugin = (
      pluginSlug
        ? store.plugins.get(pluginSlug)
        : store.plugins.getByType(ShopPluginType.BANK_GATEWAY)[0]
    ) as BankGatewayPluginContent;

    if (!bankPlugin)
      return {
        authority: new Date().toISOString(),
        provider: TransactionProvider.Manual,
        payment_method: 'get',
      };

    // env
    // if (envAllowed([Environment.Local])) {
    //   return ['https://example.com', '' + Date.now()];
    // }

    const description = `برای خرید محصولات ${products
      .map(({ title }) => title.fa ?? title.en ?? Object.values(title)[0])
      .join(' ، ')} از فروشگاه ${store.config.app_name}`;

    const response = await bankPlugin.stack[0]({
      amount,
      callback_url: `${store.env.BASE_URL}/api/v1/transaction/payment_callback/${transactionId}?amount=${amount}&currency=${store.config.currency}`,
      currency: store.config.currency,
      description,
      userPhone,
    });

    if (!response.isOk) throw new Error(response.message);

    return {
      authority: response.authority,
      expiredAt: response.expiredAt,
      payment_link: response.payment_link,
      provider: bankPlugin.slug,
      payment_method: (response.payment_method ?? 'get').toLowerCase(),
      payment_headers: response.payment_headers,
      payment_body: response.payment_body,
      payment_message: response.payment_message || response.message,
    };
  }

  async handlePayment({
    transaction,
    forceFailedAction,
    forceSuccessAction,
    successAction,
    failedAction,
    extraFields,
    statusWithoutVerify,
    statusWithVerify,
    sendSuccessSMS = true,
  }: HandlePaymentArgs) {
    const _clearTimer = (authority: string) => {
      const expiredTimer = this.transactionSupervisors.get(authority + '-1');
      const notifTimer = this.transactionSupervisors.get(authority + '-2');

      [expiredTimer, notifTimer]
        .filter((t) => t)
        .forEach((timer, index) => {
          clearTimeout(timer as any);
          this.transactionSupervisors.delete(`${authority}-${index + 1}`);
        });
    };

    const _success = async () => {
      const update: UpdateQuery<TransactionDocument> = {
        $set: {
          status: TransactionStatus.Paid,
          paidAt: new Date(),
        },
        $unset: { expiredAt: '' },
      };

      const newT = await this.transactionModel.findOneAndUpdate(
        { _id: transaction._id },
        update,
        { new: true }
      );
      await orderUtils.updateOrder(newT, {
        sendSuccessSMS,
        updateStatus: true,
      });
      return;
    };

    const _failed = async (status: TransactionStatus) => {
      const newT = await this.transactionModel.findOneAndUpdate(
        { _id: transaction._id },
        { status, active: false, $unset: { expiredAt: '' } },
        { new: true }
      );

      await orderUtils.updateOrder(newT, { updateStatus: true });
    };

    const _core = async () => {
      if (transaction.status === TransactionStatus.Paid) {
        if (forceSuccessAction) await _success();
        return { status: PaymentVerifyStatus.CheckBefore, transaction };
      } else if (
        [
          TransactionStatus.Canceled,
          TransactionStatus.Failed,
          TransactionStatus.Expired,
        ].includes(transaction.status)
      ) {
        if (forceFailedAction)
          await _failed(
            utilsService.combineStatuses(
              transaction.status,
              statusWithVerify,
              statusWithoutVerify
            )
          );
        return { status: PaymentVerifyStatus.Failed, transaction };
      }

      if (transaction.status !== TransactionStatus.NeedToPay)
        throw new BadRequestError(
          `transaction status invalid, current status: ${transaction.status}`
        );

      let status = statusWithoutVerify;
      if (!statusWithoutVerify)
        status = (
          await this.verifyPayment({
            ...extraFields,
            authority: transaction.authority,
            amount: transaction.amount,
          })
        ).status;

      // convert status
      const transactionStatus = utilsService.combineStatuses(
        status,
        statusWithVerify
      );

      switch (transactionStatus) {
        case TransactionStatus.Paid:
          if (successAction || forceSuccessAction) await _success();
          break;
        case TransactionStatus.Failed:
        case TransactionStatus.Expired:
        case TransactionStatus.Canceled:
          if (failedAction || forceFailedAction)
            await _failed(transactionStatus);
          break;
      }

      return { status, transaction };
    };

    // not exists
    if (!transaction) {
      return { status: PaymentVerifyStatus.Failed };
    }

    // clear timer
    _clearTimer(transaction.authority);

    // core
    return await _core();
  }

  private async transactionSupervisor(
    transaction: TransactionDocument,
    order: OrderDocument | null,
    {
      clear,
      expired_watcher,
      notif_watcher,
      watchers_timeout = (store.config.limit.transaction_expiration_s ?? -1) *
        1_000,
    }: {
      clear?: boolean;
      expired_watcher?: boolean;
      notif_watcher?: boolean;
      watchers_timeout?: number;
    }
  ) {
    order = order ?? (await this.orderModel.findById(transaction.order));
    const limit = store.config.limit;
    // clear
    if (clear) {
      // inactive products
      await this.productModel.bulkWrite(
        order.products.flatMap((p) =>
          p.combinations.map((d) => ({
            updateOne: {
              filter: { _id: p._id, 'combinations._id': d._id },
              update: { $inc: { 'combinations.$.quantity': -d.quantity } },
            },
          }))
        ),
        { ordered: false }
      );
    }

    // watchers
    if (expired_watcher && watchers_timeout > 0) {
      // create watcher
      // 1. Expire
      const expiredTimer = setTimeout(async () => {
        try {
          this.transactionSupervisors.delete(transaction.authority + '-1');
          const td = await this.transactionModel.findOne({
            _id: transaction._id,
            status: TransactionStatus.NeedToPay,
          });
          if (!td) return;
          await this.handlePayment({
            transaction: td,
            successAction: true,
            failedAction: true,
            statusWithVerify: TransactionStatus.Expired,
          });
        } catch (err) {}
      }, watchers_timeout);
      this.transactionSupervisors.set(
        transaction.authority + '-1',
        expiredTimer
      );
    }

    if (
      notif_watcher &&
      watchers_timeout > 0 &&
      limit.approach_transaction_expiration > 0
    ) {
      //2. Notification Before Expired
      const notifTimer = setTimeout(async () => {
        try {
          this.transactionSupervisors.delete(transaction.authority + '-2');
          const td = await this.transactionModel.findOne({
            _id: transaction._id,
            status: TransactionStatus.NeedToPay,
            active: true,
          });
          if (!td) return;
          const order = await this.orderModel.findOne({
            _id: transaction.order,
            status: OrderStatus.NeedToPay,
          });
          order && orderUtils.sendOnExpire(order)?.then();
        } catch (err) {}
      }, watchers_timeout * limit.approach_transaction_expiration);
      this.transactionSupervisors.set(transaction.authority + '-2', notifTimer);
    }
  }

  private verifyPayment(query: BankGatewayVerifyArgs) {
    const bankPlugin = store.plugins.get(
      ShopPluginType.BANK_GATEWAY
    ) as BankGatewayPluginContent;
    if (!bankPlugin) throw new NotImplement('bank gateway plugin not exist');

    return bankPlugin.stack[1](query);
  }

  private async unverifiedPayments() {
    const bankPlugin = store.plugins.get(
      ShopPluginType.BANK_GATEWAY
    ) as BankGatewayPluginContent;
    if (!bankPlugin) return [];
    return await bankPlugin.stack[2]();
  }

  async synchronize() {
    try {
      const taskId = [];
      const _unverified_authorities = async () => {
        const unverified = await this.unverifiedPayments();
        // unverified authorities
        return unverified.map(async ({ authority, ...props }) => {
          if (taskId.includes(authority)) return;
          taskId.push(authority);
          const transaction = await this.getNeedToPayTransactions(
            {
              authority,
            },
            false
          );
          if (!transaction) return;
          return await this.handlePayment({
            transaction,
            successAction: true,
            failedAction: false,
            extraFields: props,
          });
        });
      };
      const _expired_transactions = async () => {
        const expiredTransactions = await this.transactionModel.find({
          expiredAt: { $lt: new Date() },
          status: TransactionStatus.NeedToPay,
          active: true,
        });
        // expired transactions
        return expiredTransactions.map((transaction) => {
          if (taskId.includes(transaction.authority)) return;
          taskId.push(transaction.authority);
          return this.handlePayment({
            transaction,
            successAction: true,
            failedAction: true,
            statusWithVerify: TransactionStatus.Expired,
          });
        });
      };
      const _watcher_transactions = async () => {
        const openTransactions = await this.transactionModel.find({
          active: true,
          status: TransactionStatus.NeedToPay,
          expiredAt: { $gt: new Date() },
        });
        return openTransactions.map((transaction) => {
          if (taskId.includes(transaction.authority)) return;
          taskId.push(transaction.authority);
          return this.transactionSupervisor(transaction, null, {
            expired_watcher: true,
            watchers_timeout: transaction.expiredAt.getTime() - Date.now(),
          });
        });
      };
      const promises = [
        ...(await _unverified_authorities()),
        ...(await _expired_transactions()),
        ...(await _watcher_transactions()),
      ];
      // execute parallel
      await Promise.all(promises);
    } catch (err) {
      logger.error('order sync job error\n', axiosError2String(err));
    }
  }
}

const paymentService = new PaymentService();
export default paymentService;
