import { MiddleWare, Req, ValidationError } from '@nodeeweb/core';
import { FilterQuery, Query, UpdateQuery } from 'mongoose';
import {
  ITransaction,
  TransactionCreator,
  TransactionDocument,
  TransactionStatus,
} from '../../schema/transaction.schema';
import {
  TransactionCreateBody,
  TransactionUpdateBody,
} from '../../dto/in/transaction';
import { UserModel } from '@nodeeweb/core/types/user';
import store from '../../store';
import { OrderModel, OrderStatus } from '../../schema/order.schema';
import orderUtils from '../order/utils.service';

class Service {
  private get orderModel(): OrderModel {
    return store.db.model('order');
  }
  private getUserModel(type: 'admin' | 'customer'): UserModel {
    return store.db.model(type);
  }

  private async validate(body: TransactionCreateBody | TransactionUpdateBody) {
    // payer
    if (body.payer) {
      const user = await this.getUserModel(body.payer.type).findOne({
        _id: body.payer._id,
        active: true,
      });
      if (!user) throw new ValidationError('invalid payer');
    }

    // order
    if (body.order) {
      const order = await this.orderModel.findOne({
        _id: body.order,
        ...(body.payer ? { 'customer._id': body.payer._id } : {}),
        active: true,
        status: OrderStatus.NeedToPay,
      });

      if (!order)
        throw new ValidationError(
          'not found any need to pay order that match with sent payer'
        );
    }
  }

  private parseFilter(req: Req): FilterQuery<ITransaction> {
    const userType = req.user.type;
    if (userType === 'admin') return { active: true };
    return { active: true, 'payer._id': req.user._id };
  }

  parseCountFilter = (req: Req) => {
    return this.parseFilter(req);
  };
  parseGetAllFilter = (req: Req) => {
    return this.parseFilter(req);
  };
  parseGetOneFilter = (req: Req) => {
    return { _id: req.params.id, ...this.parseFilter(req) };
  };

  beforeCreate: MiddleWare = async (req, res, next) => {
    const body: TransactionCreateBody = req.body;

    // currency
    if (!body.currency) body.currency = store.config.currency;

    // creator category
    body['creator_category'] = TransactionCreator.Admin;

    // validate
    await this.validate(body);

    return next();
  };
  afterCreate: MiddleWare = async (req, res, next) => {
    const transaction: ITransaction = req.crud;
    const needUpdateOrder = Boolean(transaction.order);

    // return
    if (needUpdateOrder) {
      await orderUtils.updateOrder(
        { ...transaction, modelName: 'transaction' } as any,
        {
          pushTransaction: true,
          sendSuccessSMS: true,
          updateStatus: true,
        }
      );
    }

    return res.status(201).json({ data: transaction });
  };

  parseUpdateBody = async (req: Req) => {
    const body: TransactionUpdateBody = req.body;
    // base validate
    await this.validate(body);

    // extra validate
    if (
      body.status &&
      // update other things with paid status
      Object.values(body).filter((k) => k).length > 1
    ) {
      throw new ValidationError(
        'can not update status and update other attributes'
      );
    }
    return body;
  };
  parseUpdateFilter = (req: Req) => {
    const update: FilterQuery<TransactionDocument> = {
      _id: req.params.id,
      active: true,
    };
    const updatedAttrs = Object.entries(req.body).filter(
      ([k, v]) => v && k !== 'status'
    ).length;

    if (updatedAttrs) update.status = TransactionStatus.NeedToPay;
    return update;
  };
  afterUpdate: MiddleWare = async (req, res, next) => {
    const transaction: TransactionDocument = req.crud;
    const needUpdateOrder = Boolean(transaction.order);

    // return
    if (needUpdateOrder) {
      await orderUtils.updateOrder(transaction, {
        pushTransaction: true,
        sendSuccessSMS: true,
        updateStatus: true,
      });
    }

    return res.status(200).json({ data: transaction });
  };
}

export default new Service();
