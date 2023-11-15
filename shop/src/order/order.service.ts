import { merge } from 'lodash';
import {
  BadRequestError,
  CRUD_DEFAULT_REQ_KEY,
  MiddleWare,
  NotFound,
  Req,
  Res,
} from '@nodeeweb/core';
import {
  OrderDocument,
  OrderModel,
  OrderStatus,
} from '../../schema/order.schema';
import utils from './utils.service';
import store from '../../store';
import transactionUtils from '../transaction/utils.service';
import { UpdateQuery } from 'mongoose';
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
    let extraUpdate: UpdateQuery<OrderDocument> = {};

    // update status
    if (body.status) {
      // payment issue
      if (
        order.status === OrderStatus.NeedToPay &&
        !isIn(body.status, [OrderStatus.Cart, OrderStatus.NeedToPay])
      ) {
        //  need update transaction
        if (order.transactions.length) {
          throw new BadRequestError(
            `can not update need-to-pay order status until its transactions exists, try update transactions`
          );
        }

        // update order without transaction
        extraUpdate = await utils.updateOrder(
          order,
          transactionUtils.convertStatus(body.status),
          {
            exec: false,
            updateStatus: true,
          }
        );
      }
    }

    const newOrder = await this.orderModel.findOneAndUpdate(
      { _id: order._id },
      merge({}, { $set: body }, extraUpdate)
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
