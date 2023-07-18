import { CRUD_DEFAULT_REQ_KEY } from '@nodeeweb/core/src/constants/String';
import store from '@nodeeweb/core/store';
import { MiddleWare, Req, Res } from '@nodeeweb/core/types/global';
import mongoose from 'mongoose';

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
      'phoneNumber',
      'internationalCode',
      'address',
    ];
    return res.status(200).json({
      customer: Object.fromEntries(fields.map((f) => [f, customer[f]])),
    });
  };

  static parseFilterForAllCustomer(req: Req) {
    let search = {};
    if (req.params.search) {
      search['title.' + req.headers.lan] = {
        $exists: true,
        $regex: req.params.search,
        $options: 'i',
      };
    }
    if (req.query.search) {
      search['title.' + req.headers.lan] = {
        $exists: true,
        $regex: req.query.search,
        $options: 'i',
      };
    }
    if (req.query.Search) {
      search['title.' + req.headers.lan] = {
        $exists: true,
        $regex: req.query.Search,
        $options: 'i',
      };
    }
    if (req.query) {
      console.log(req.query);
    }

    let thef = req.query;
    if (
      thef.firstName ||
      thef.lastName ||
      thef.phoneNumber ||
      thef.internationalCode
    ) {
      search = { $or: [] };
    }
    if (thef.firstName) {
      search['$or'].push({
        firstName: { $regex: thef.firstName, $options: 'i' },
      });
    }
    if (thef.lastName) {
      search['$or'].push({
        lastName: { $regex: thef.lastName, $options: 'i' },
      });
    }
    if (thef.phoneNumber) {
      search['$or'].push({
        phoneNumber: { $regex: thef.phoneNumber, $options: 'i' },
      });
    }
    if (thef.internationalCode) {
      search['$or'].push({
        internationalCode: { $regex: thef.internationalCode, $options: 'i' },
      });
    }

    return search;
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

    return res.json(Object.values(obj));
  };

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
}
export default Service;
