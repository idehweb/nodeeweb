import { NextFunction } from 'express';
import store from '../../store';
import {
  AuthStrategy,
  IUser,
  UserModel,
  IUserMethods,
  UserDocument,
} from '../../types/auth';
import { Req, Res } from '../../types/global';
import { setToCookie, signToken } from '../handlers/auth.handler';
import { ForbiddenError, NotFound } from '../../types/error';

export const USER_PASS_STRATEGY = 'user-pass';
export default class UserPassStrategy extends AuthStrategy {
  strategyId = USER_PASS_STRATEGY;
  detect(req: Req, res: Res, next: NextFunction) {
    return this.login(req, res);
  }

  async login(req: Req, res: Res) {
    const { username, password } = req.body;

    const model = store.db.model(req.modelName);
    const user: UserDocument = await model.findOne({ username }, '+password');
    if (!user) throw new NotFound('user not found');
    if (!user.active) throw new ForbiddenError('user inactive');

    if (!user || !(await user.passwordVerify(password)))
      return res.status(400).json({ message: 'username or password is wrong' });

    // sign token
    const token = signToken(user.id);

    // cookie
    setToCookie(res, token);

    return res.status(200).json({
      data: {
        user: { ...user.toObject(), password: undefined, tokens: [{ token }] },
        token,
      },
    });
  }
  async signup(req: Req, res: Res) {
    const userModel = store.db.model<IUser, UserModel>(req.modelName);

    // TODO validate body

    const user = await userModel.create(req.body);
    const token = signToken(user.id);
    setToCookie(res, token, 'authToken');
    return res.status(201).json({
      user: { ...user.toObject(), password: undefined },
      token,
    });
  }
}
