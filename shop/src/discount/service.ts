import { MiddleWare, Req } from '@nodeeweb/core/types/global';
import store from '@nodeeweb/core/store';
import { DiscountDocument, DiscountModel } from '../../schema/discount.schema';
import { CRUD_DEFAULT_REQ_KEY, NotFound, createLogger } from '@nodeeweb/core';

class DiscountService {
  get discountModel() {
    return store.db.model('discount') as DiscountModel;
  }

  async consumeDiscount(req: Req) {
    const query = this.getOneQueryParser(req);

    const discount = await this.discountModel.findOneAndUpdate(
      query,
      {
        $inc: {
          usageLimit: -1,
        },
        $push: {
          consumers: req.user._id,
        },
      },
      { new: true }
    );
    if (!discount) throw new NotFound('discount not found');

    return discount;
  }

  getOne(req: Req) {
    return this.discountModel.findOne(this.getOneQueryParser(req, false));
  }

  getOneQueryParser(req: Req, effectAdmin = true) {
    const userId = req.user._id;
    const discountCode =
      req.params.discount || req.query.discount || req.body.discount;
    return req.modelName === 'admin' && effectAdmin
      ? {
          code: discountCode,
        }
      : {
          $and: [
            {
              code: discountCode,
              active: true,
              consumers: {
                $ne: userId,
              },
              usageLimit: { $gt: 0 },
            },
            {
              // expired at
              $or: [
                { expiredAt: { $exists: false } },
                { expiredAt: { $gte: new Date() } },
              ],
            },
          ],
        };
  }
  getOneTransform(discount: DiscountDocument, req: Req) {
    return req.modelName === 'admin'
      ? discount
      : {
          code: discount.code,
          amount: discount.amount,
          maxAmount: discount.maxAmount,
          percentage: discount.percentage,
          expiredAt: discount.expiredAt,
        };
  }
  updateOneParseFilter = (req: Req) => {
    return this.getOneQueryParser(req, false);
  };
}

const discountService = new DiscountService();
export default discountService;
