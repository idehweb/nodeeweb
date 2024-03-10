import { merge } from 'lodash';
import {
  BadRequestError,
  CRUD,
  CRUD_DEFAULT_REQ_KEY,
  EntityCreator,
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
import utils, { Utils } from './utils.service';
import store from '../../store';
import transactionUtils from '../transaction/utils.service';
import { UpdateQuery } from 'mongoose';
import { isIn } from 'class-validator';
import { getEntityEventName } from '@nodeeweb/core/src/handlers/entity.handler';

class OrderService {
  get orderModel(): OrderModel {
    return store.db.model('order');
  }
  async getAllFilterParser(req: Req) {
    const baseFilter = await new EntityCreator('').parseFilterQuery({}, req);
    if (req.modelName === 'admin') {
      return baseFilter;
    }
    return {
      ...baseFilter,
      'customer._id': req.user._id,
      status: { $ne: OrderStatus.Cart },
      active: true,
    };
  }
  getOneFilterParser(req: Req) {
    const base = {
      _id: req.params.order,
    };

    if (req.modelName === 'customer') {
      base['active'] = true;
      base['customer._id'] = req.user._id;
      base['status'] = { $ne: OrderStatus.Cart };
    }
    return base;
  }
  async submitOrder(req: Req,res: Res){
    console.log('submitOrder');
    const {body}=req;
    const Order = store.db.model('order');
    try{
      let order=await Order.create(body);
      return res.json({ data: order });
    }catch (e){
      return res.status(400).json({ error: e });
    }
  }

  update: MiddleWare = async (req, res) => {
    // emit event
    store.event.emit(
      getEntityEventName('order', { pre: true, type: CRUD.UPDATE_ONE }),
      { type: CRUD.UPDATE_ONE, model: 'order' },
      req
    );

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
      merge({}, { $set: body }, extraUpdate),
      { new: true }
    );

    // sms
    body.status && utils.sendOnStateChange(newOrder);

    // emit event
    store.event.emit(
      getEntityEventName('order', { post: true, type: CRUD.UPDATE_ONE }),
      newOrder,
      { type: CRUD.UPDATE_ONE, model: 'order' },
      req
    );

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

  delete = async (order: OrderDocument, req: Req) => {
    if (!order) throw new NotFound('order not found');

    // cancel order
    await utils.cancelOrder(order);

    return;
  };
  deleteFilter(req: Req) {
    return {
      _id: Object.values(req.params).filter(
        (p) => typeof p === 'string' && p
      )[0],
      active: true,
    };
  }
}

const orderService = new OrderService();
export default orderService;
