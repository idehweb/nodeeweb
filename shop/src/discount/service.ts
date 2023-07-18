import { classCatchBuilder } from '@nodeeweb/core/utils/catchAsync';
import { serviceOnError } from '../common/service';
import { MiddleWare } from '@nodeeweb/core/types/global';
import store from '@nodeeweb/core/store';

class Service {
  static setDiscount: MiddleWare = async (req, res) => {
    const Discount = store.db.model('discount');

    const discount = await Discount.findOne({ slug: req.params.id });
    if (!discount)
      return res.status(404).json({
        success: false,
        message: 'did not find any discount!',
        id: req.params.id,
      });

    if (discount.count < 1) {
      return res.status(403).json({
        success: false,
        message: 'discount is done!',
      });
    }
    if (!discount.customer) {
      discount.customer = [];
    }

    if (discount.customer && discount.customer.length > 0) {
      var isInArray = (discount.customer as any[]).some(function (cus) {
        return cus.equals(req.user._id);
      });

      if (isInArray && discount.customerLimit) {
        return res.status(403).json({
          success: false,
          message: 'you have used this discount once!',
        });
      }
    }
    return res.status(200).json(discount);
  };
  static onError = serviceOnError('Discount');
}

classCatchBuilder(Service);

export default Service;
