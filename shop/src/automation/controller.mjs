import { classCatchBuilder } from '../../../utils/catchAsync.mjs';
import {
  createAutomation,
  deleteAutomation,
  updateAutomation,
} from './utils.mjs';
const cronregex = new RegExp(
  /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/
);
class Controller {
  static _getModel(req) {
    return req.mongoose.model('Automation');
  }
  static async getAll(req, res) {
    const autos = await Controller._getModel(req).find({});
    return res.status(200).json({ status: 'success', data: autos });
  }
  static async createOne(req, res) {
    let { crontab_expr, query_pipe, aggregation_pipe, action, name } = req.body;

    // crontab expr
    if (!cronregex.test(crontab_expr))
      return res
        .status(400)
        .json({ status: 'error', message: 'crontab_expr not valid' });

    // pipeline
    if ((query_pipe && aggregation_pipe) || (!query_pipe && !aggregation_pipe))
      return res.status(400).json({
        status: 'error',
        message: 'invalid pipe , one of the query or aggregation must exist',
      });

    try {
      const auto = await Controller._getModel(req).create({
        crontab_expr,
        query_pipe,
        aggregation_pipe,
        action,
        name,
      });
      createAutomation(auto, req.mongoose);
      return res.status(200).json({ status: 'success', data: auto });
    } catch (err) {
      return res.status(400).json({ status: 'error', message: err.message });
    }
  }
  static async updateOne(req, res) {
    const { name, crontab_expr } = req.body;
    const { id } = req.params;
    const auto = await Controller._getModel(req).findByIdAndUpdate(
      id,
      {
        $set: { name, crontab_expr },
      },
      { new: true }
    );
    await updateAutomation(auto, req.mongoose);
    return res.status(200).json({ status: 'success', data: auto });
  }
  static async deleteOne(req, res) {
    const { id } = req.params;
    await deleteAutomation(id, req.mongoose, true);
  }
  onError(err, req, res, next) {
    console.log('#OnError', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
}

export default classCatchBuilder(Controller);
