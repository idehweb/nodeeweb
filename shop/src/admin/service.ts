import { classCatchBuilder } from '@nodeeweb/core/utils/catchAsync';
import { serviceOnError } from '../common/service';
import { MiddleWare, setToCookie, signToken, store } from '@nodeeweb/core';
import { AdminModel, IAdmin } from '../../schema/admin.schema';

export default class Service {
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

  static onError = serviceOnError('Admin');
}

classCatchBuilder(Service);
