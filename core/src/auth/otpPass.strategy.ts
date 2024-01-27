import { NextFunction } from 'express';
import { AuthStrategy } from '../../types/auth';
import { Req, Res } from '../../types/global';
import store from '../../store';
import {
  AuthStrategyBody,
  OtpPassStrategyDetect,
} from '../../dto/in/auth/index.dto';
import { IUser, UserDocument, UserModel, UserStatus } from '../../types/user';
import { CoreValidationPipe } from '../core/validate';
import { isUndefined } from 'lodash';
import { BadRequestError, ForbiddenError, NotFound } from '../../types/error';
import { sendCode } from './otp.utils';

export const OTP_PASS_STRATEGY = 'otp-pass';
export class OtpPassStrategy extends AuthStrategy {
  private get validation() {
    return (store.globalMiddleware.pipes['validation'] ??
      new CoreValidationPipe()) as CoreValidationPipe;
  }

  private async transformDetect(data: any) {
    const transformed = await this.validation.transform(
      data,
      OtpPassStrategyDetect
    );
    return Object.fromEntries(
      Object.entries(transformed).filter(([k, v]) => !isUndefined(v))
    ) as OtpPassStrategyDetect;
  }

  getUserModel(req: Req): UserModel {
    return store.db.model(req.modelName);
  }
  async exportUser(req: Req) {
    if (req.user !== undefined) return req.user;

    const model = this.getUserModel(req);
    const user: UserDocument = await model.findOne(req.body.user, '+password');
    req.user = user;

    return user;
  }

  private async createUser(modelName: string, iuser: Partial<IUser>) {
    const userModel = store.db.model(modelName) as UserModel;
    const user = await userModel.create(iuser);
    return user;
  }

  async detect(req: Req, res: Res, next: NextFunction) {
    const { login, signup } = req.body as AuthStrategyBody;

    // transform user data
    req.body.user = await this.transformDetect(req.body.user ?? {});

    // export user
    req.user = await this.exportUser(req);

    // init attrs
    const isExist = Boolean(req.user?.active);
    const isPasswordSet = Boolean(req.user?.password);
    const isPhoneSet = Boolean(req.user?.phone);

    // res body
    req.res_body = { data: { userExists: isExist, isPasswordSet, isPhoneSet } };

    // invalid states
    if (isExist && !login && signup) throw new BadRequestError('user exists');
    if (!isExist && !signup && login) throw new NotFound('user not exists');

    // create user if want signup
    if (signup && !isExist) {
      if (req.modelName === 'admin')
        throw new ForbiddenError('can not register admin');

      if (!req.user)
        req.user = await this.createUser(req.modelName, {
          phone: req.body.user.phone,
          status: [{ status: UserStatus.NeedVerify }],
          active: false,
        });
    }

    if (login || signup) {
      // progress
      return await sendCode(req, res);
    }

    return res.json(req.res_body);
  }

  async login(req: Req, res: Res, next: NextFunction) {
    return next();
  }

  async signup(req: Req, res: Res, next: NextFunction) {
    return next();
  }
  strategyId = OTP_PASS_STRATEGY;
}
