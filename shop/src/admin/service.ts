import { serviceOnError } from '../common/service';
import {
  MiddleWare,
  NotImplement,
  Req,
  setToCookie,
  signToken,
  store,
} from '@nodeeweb/core';
import { AdminModel, IAdmin } from '../../schema/admin.schema';

export default class Service {
  static _parseFilter(req: Req) {
    if (req.params.id === 'me') return { _id: req.user._id };
    return { _id: req.params.id };
  }
  static getOneParseFilter(req: Req) {
    return Service._parseFilter(req);
  }
  static updateOneParseFilter(req: Req) {
    return Service._parseFilter(req);
  }

  static login: MiddleWare = async (req, res) => {
    const adminModel = store.db.model<IAdmin, AdminModel>('admin');
    const { username, password } = req.body;

    // validate body
    if (!username || !password)
      return res.status(400).json({ message: 'username and password need' });

    const admin = await adminModel.findOne(
      { username, active: true },
      '+password'
    );

    if (!admin || !(await admin.passwordVerify(password)))
      return res.status(400).json({ message: 'username or password is wrong' });

    // sign token
    const token = signToken(admin.id);

    // cookie
    setToCookie(res, token);

    return res.status(200).json({
      data: {
        user: { ...admin.toObject(), password: undefined, tokens: [{ token }] },
        token,
      },
    });
  };

  static resetAdmin: MiddleWare = async () => {
    throw new NotImplement();
  };
}
