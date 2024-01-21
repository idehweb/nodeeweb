import { EntityCreator } from '@nodeeweb/core';
import { CRUD_DEFAULT_REQ_KEY } from '@nodeeweb/core/src/constants/String';
import { MiddleWare, Req, Res } from '@nodeeweb/core/types/global';
import mongoose, { FilterQuery } from 'mongoose';
import { CustomerSource } from '../../schema/customer.schema';
import { transformBody } from './utils';
import store from '../../store';

export class Service {
  static getMe: MiddleWare = (req, res, next) => {
    const customer = req.user;
    const fields = [
      '_id',
      'email',
      'nickname',
      'firstName',
      'lastName',
      'data',
      'phone',
      'internationalCode',
      'address',
    ];
    return res.status(200).json({
      customer: Object.fromEntries(fields.map((f) => [f, customer[f]])),
    });
  };

  static async parseFilterForAllCustomer(req: Req) {
    let search = {};
    if (req.query.search) {
      search['title.' + req.headers.lan] = {
        $exists: true,
        $regex: req.query.search,
        $options: 'i',
      };
      delete req.query.search;
    }
    if (req.query.Search) {
      search['title.' + req.headers.lan] = {
        $exists: true,
        $regex: req.query.Search,
        $options: 'i',
      };
      delete req.query.Search;
    }

    const orQueries = ['firstName', 'lastName', 'phone', 'internationalCode']
      .filter((k) => req.query[k])
      .map((k) => {
        const q = {
          [k]: { $regex: req.query[k], $options: 'i' },
        };
        delete req.query[k];
        return q;
      });

    if (orQueries.length) search['$or'] = orQueries;

    const filterFromBase = await new EntityCreator('').parseFilterQuery(
      {},
      req
    );

    return { ...filterFromBase, ...search };
  }

  static getAll: MiddleWare = async (req, res) => {
    const obj = Object.fromEntries(
      req[CRUD_DEFAULT_REQ_KEY].map((customer: any) => [
        String(customer._id),
        customer._doc,
      ])
    );

    // aggregate
    const orderCounts = await store.db.model('order').aggregate(
      [
        {
          $match: {
            customer: {
              $in: Object.keys(obj).map(
                (id) => new mongoose.Types.ObjectId(id)
              ),
            },
          },
        },
        {
          $group: {
            _id: '$customer',
            count: { $sum: 1 },
          },
        },
      ],
      { allowDiskUse: true }
    );

    // set count
    orderCounts.forEach(({ _id, count }) => {
      obj[String(_id)].orderCount = count;
    });

    return res.json({ data: Object.values(obj) });
  };

  static _parseFilter(req: Req) {
    if (req.modelName === 'customer' || req.params.id === 'me')
      return { _id: req.user._id };
    return { _id: req.params.id };
  }
  static getOneParseFilter(req: Req) {
    return Service._parseFilter(req);
  }
  static updateOneParseFilter(req: Req) {
    return Service._parseFilter(req);
  }
  static updateOneParseUpdate(req: Req) {
    let body: any;
    if (req.modelName === 'customer') body = { address: req.body.address };
    else body = transformBody(req);

    return body;
  }

  static updateStatus: MiddleWare = async (req, res) => {
    const customer = await store.db.model('customer').findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          status: {
            user: req.headers._id,
            status: req.body.status,
            description: req.body.description,
          },
        },
      },
      { new: true }
    );

    res.json({
      success: true,
      post: customer,
    });
  };

  static createParseBody(req: Req) {
    return { ...transformBody(req), source: CustomerSource.Panel };
  }
  static deleteParseUpdate() {
    return [
      {
        $addFields: {
          username: { $concat: ['$username', '-deleted', `-${Date.now()}`] },
          phone: {
            $concat: ['$phone', '-deleted', `-${Date.now()}`],
          },
          email: { $concat: ['$email', '-deleted', `-${Date.now()}`] },
          active: false,
        },
      },
    ];
  }
}
export default Service;
