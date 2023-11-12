import { Req } from '@nodeeweb/core';
import { FilterQuery } from 'mongoose';
import { ITransaction } from '../../schema/transaction.schema';

class Service {
  private parseFilter(req: Req): FilterQuery<ITransaction> {
    const userType = req.user.type;
    if (userType === 'admin') return { active: true };
    return { active: true, consumer: req.user._id };
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
  parseCreateBody(req: Req) {
    return req.body;
  }
  parseUpdateBody(req: Req) {
    return req.body;
  }
}

export default new Service();
