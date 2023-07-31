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
  async exportUser(req: Req, throwOnNotFound = true) {
    if (req.user) return req.user;

    const { username } = req.body.user;
    if (!username) return;

    const model = store.db.model(req.modelName);
    const user: UserDocument = await model.findOne({ username }, '+password');
    if (!user && throwOnNotFound) throw new NotFound('user not found');
    if (user && !user.active) throw new ForbiddenError('user inactive');
    req.user = user;

    return user;
  }

  async detect(req: Req, res: Res, next: NextFunction) {
    const { login, signup } = req.body;
    await this.exportUser(req, !signup && login);

    if (login && req.user) return await this.login(req, res);
    if (signup && !req.user) return await this.signup(req, res);
    return res.json({ data: { userExists: Boolean(req.user) } });
  }

  async login(req: Req, res: Res) {
    const { password } = req.body.user;
    const user = await this.exportUser(req);
    if (!user || !(await user.passwordVerify(password)))
      return res.status(400).json({ message: 'username or password is wrong' });

    // sign token
    const token = signToken(user.id);

    // cookie
    setToCookie(res, token);

    return res.status(200).json({
      data: {
        user: { ...user.toObject(), password: undefined },
        token,
      },
    });
  }
  async signup(req: Req, res: Res) {
    const userModel = store.db.model<IUser, UserModel>(req.modelName);

    // TODO validate body

    const user = await userModel.create(req.body.user);
    const token = signToken(user.id);
    setToCookie(res, token, 'authToken');
    return res.status(201).json({
      user: { ...user.toObject(), password: undefined },
      token,
    });
  }
}
