import { MiddleWare, Req, ValidationError } from '@nodeeweb/core';
import { FilterQuery, Query } from 'mongoose';
import {
  ITransaction,
  TransactionDocument,
  TransactionStatus,
} from '../../schema/transaction.schema';
import { TransactionCreateBody } from '../../dto/in/transaction';
import { UserModel } from '@nodeeweb/core/types/user';
import store from '../../store';
import { OrderModel, OrderStatus } from '../../schema/order.schema';

class Service {
  private get orderModel(): OrderModel {
    return store.db.model('order');
  }
  private getUserModel(type: 'admin' | 'customer'): UserModel {
    return store.db.model(type);
  }
  private parseFilter(req: Req): FilterQuery<ITransaction> {
    const userType = req.user.type;
    if (userType === 'admin') return { active: true };
    return { active: true, 'consumer._id': req.user._id };
  }

  parseCountFilter(req: Req) {
    return this.parseFilter(req);
  }
  parseGetAllFilter(req: Req) {
    return this.parseFilter(req);
  }
  parseGetOneFilter(req: Req) {
    return { _id: req.params.id, ...this.parseFilter(req) };
  }

  beforeCreate: MiddleWare = async (req, res, next) => {
    const body: TransactionCreateBody = req.body;

    // consumer
    if (body.consumer) {
      const user = await this.getUserModel(body.consumer.type).findOne({
        _id: body.consumer._id,
        active: true,
      });
      if (!user) throw new ValidationError('invalid consumer');
    }

    // currency
    if (!body.currency) body.currency = store.config.currency;

    // order
    if (body.order) {
      const order = await this.orderModel.findOne({
        _id: body.order,
        ...(body.consumer ? { customer: body.consumer._id } : {}),
        active: true,
        status: OrderStatus.NeedToPay,
      });

      if (!order)
        throw new ValidationError(
          'not found any need to pay order that match with sent consumer'
        );
    }

    return next();
  };
  afterCreate: MiddleWare = async (req, res, next) => {
    const transaction: TransactionDocument = req.crud;
    const needUpdateOrder =
      transaction.status === TransactionStatus.Paid && transaction.order;

    // return
    if (needUpdateOrder) {
      // TODO update order
    }

    return res.status(201).json({ data: transaction });
  };

  parseCreateBody(req: Req) {
    return req.body;
  }
  parseUpdateBody(req: Req) {
    return req.body;
  }
}

export default new Service();
