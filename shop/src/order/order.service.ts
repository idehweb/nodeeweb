import {
  BadRequestError,
  CRUD_DEFAULT_REQ_KEY,
  Req,
  Res,
} from '@nodeeweb/core';
import { OrderStatus } from '../../schema/order.schema';
import utils from './utils.service';

class OrderService {
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
      _id: req.params.id,
    };

    if (req.modelName === 'customer') {
      base['active'] = true;
      base['customer._id'] = req.user._id;
    }

    return base;
  }
  updateOneFilterParser(req: Req) {
    return {
      _id: req.params.id,
      status: OrderStatus.Posting,
      active: true,
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
