import { NextFunction } from 'express';
import store from '../../store';
import { AuthStrategy } from '../../types/auth';
import { Req, Res } from '../../types/global';
import { setToCookie, signToken } from '../handlers/auth.handler';
import { ForbiddenError, NotFound, ValidationError } from '../../types/error';
import { CoreValidationPipe } from '../core/validate';
import {
  UserPassUserLogin,
  UserPassUserSignup,
} from '../../dto/in/auth/index.dto';
import { IUser, UserDocument, UserModel } from '../../types/user';
import { AuthEvents } from './authGateway.strategy';

export const USER_PASS_STRATEGY = 'user-pass';
export default class UserPassStrategy extends AuthStrategy {
  strategyId = USER_PASS_STRATEGY;

  private get validation() {
    return (store.globalMiddleware.pipes['validation'] ??
      new CoreValidationPipe()) as CoreValidationPipe;
  }
  private transformLogin(user: any) {
    return this.validation.transform(user, UserPassUserLogin);
  }
  private transformSignup(user: any) {
    return this.validation.transform(user, UserPassUserSignup);
  }
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
    if (signup && !req.user) return await this.signup(req, res, next);
    return res.json({ data: { userExists: Boolean(req.user) } });
  }

  async login(req: Req, res: Res) {
    const userBody = await this.transformLogin(req.body.user);
    const { password } = userBody;

    const user = await this.exportUser(req);
    if (!user || !(await user.passwordVerify(password)))
      return res.status(400).json({ message: 'username or password is wrong' });

    const outUser: IUser = { ...user.toObject(), password: undefined };

    // sign token
    const token = signToken(outUser);

    // cookie
    setToCookie(res, token);

    return res.status(200).json({
      data: {
        user: outUser,
        token,
      },
    });
  }
  async signup(req: Req, res: Res, next: NextFunction) {
    const userModel = store.db.model<IUser, UserModel>(req.modelName);

    const userBody = await this.transformSignup(req.body.user);

    const user = await userModel.create(userBody);
    const token = signToken(user);
    setToCookie(res, token, 'authToken');

    // emit
    store.event?.emit(AuthEvents.AfterRegister, user);

    return res.status(201).json({
      user: { ...user.toObject(), password: undefined },
      token,
    });
  }
}
