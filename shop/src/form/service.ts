import { MiddleWare } from '@nodeeweb/core/types/global';
import store from '../../store';
import { replaceValue } from '@nodeeweb/core/utils/helpers';

export default class Service {
  static addEntry: MiddleWare = async (req, res) => {
    const Form = store.db.model('form');
    const Entry = store.db.model('entry');

    const form = await Form.findById(req.params.form, '_id');

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'not found',
      });
    }

    const trackingCode = Math.floor(10000 + Math.random() * 90000);

    await Entry.create({
      form: form._id,
      trackingCode: trackingCode,
      data: req.body,
    });

    const conf = store.config;

    return res.status(201).json({
      success: true,
      trackingCode,
      message: replaceValue({
        data: [conf.toObject(), { TRACKING_CODE: trackingCode }],
        text: conf.entry_submit_message,
      }),
    });
  };
}
