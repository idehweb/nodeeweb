import {
  BadRequestError,
  CRUD_DEFAULT_REQ_KEY,
  MiddleWare,
  NotFound,
  Req,
  Res,
} from '@nodeeweb/core';
import {
  OrderModel,
  OrderStatus,
  TransactionProvider,
} from '../../schema/order.schema';
import utils from './utils.service';
import store from '../../store';
import transactionService from './transaction.service';
import { PaymentVerifyStatus } from '../../types/order';
import { isIn } from 'class-validator';

class OrderService {
  get orderModel(): OrderModel {
    return store.db.model('order');
  }
  getAllFilterParser(req: Req) {
    if (req.modelName === 'admin') {
      return {};
    }
    return {
      'customer._id': req.user._id,
      active: true,
    };
  }
  getOneFilterParser(req: Req) {
    const base = {
      _id: req.params.order,
      status: { $ne: OrderStatus.Cart },
    };

    if (req.modelName === 'customer') {
      base['active'] = true;
      base['customer._id'] = req.user._id;
    }
    return base;
  }

  update: MiddleWare = async (req, res) => {
    const body = req.body;
    const order = await this.orderModel.findOne({
      _id: req.params.order,
      status: { $ne: OrderStatus.Cart },
      active: true,
    });

    if (!order) throw new NotFound('order not found');
    if (!order.transaction && body.status)
      throw new BadRequestError('order transaction not initiate yet');

    // update status
    if (body.status) {
      if (order.status === OrderStatus.NeedToPay) {
        if (order.transaction.provider !== TransactionProvider.Manual)
          throw new BadRequestError(
            `can not update ${order.status} order until transaction provider not equal to ${TransactionProvider.Manual}`
          );
        if (
          isIn(body.status, [
            OrderStatus.Paid,
            OrderStatus.Posting,
            OrderStatus.Completed,
          ])
        )
          await transactionService.handlePayment(
            order,
            true,
            true,
            undefined,
            PaymentVerifyStatus.Paid,
            false
          );
        else if (body.status === OrderStatus.Canceled)
          await transactionService.handlePayment(
            order,
            false,
            true,
            undefined,
            PaymentVerifyStatus.Failed,
            false
          );
      }
    }

    const newOrder = await this.orderModel.findOneAndUpdate(
      { _id: order._id },
      { $set: body }
    );

    // sms
    body.status && utils.sendOnStateChange(newOrder);

    return res.json({ data: newOrder });
  };

  updateOneFilterParser(req: Req) {
    return {
      _id: req.params.order,
      active: true,
      // status: OrderStatus.Posting,
    };
  }
  updateOneParseBody(req: Req) {
    const status = req.body.status;
    if (status) {
      if (![OrderStatus.Completed, OrderStatus.Canceled].includes(status))
        throw new BadRequestError(
          `new status must be : ${OrderStatus.Completed} or ${OrderStatus.Canceled}`
        );
    }
    return req.body;
  }
  async updateOneAfter(req: Req, res: Res) {
    const order = req[CRUD_DEFAULT_REQ_KEY];
    if (req.body.status) {
      utils.sendOnStateChange(order).then();
    }
    res.json({ data: order });
  }
}

const orderService = new OrderService();
export default orderService;
