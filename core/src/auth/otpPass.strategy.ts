import { NextFunction } from 'express';
import { AuthStrategy } from '../../types/auth';
import { Req, Res } from '../../types/global';
import store from '../../store';
import {
  AuthStrategyBody,
  OtpPassLogin,
  OtpPassSignup,
  OtpPassStrategyDetect,
} from '../../dto/in/auth/index.dto';
import { IUser, UserDocument, UserModel, UserStatus } from '../../types/user';
import { CoreValidationPipe } from '../core/validate';
import { isUndefined } from 'lodash';
import { BadRequestError, ForbiddenError, NotFound } from '../../types/error';
import { codeRevert, sendCode, verifyCode } from './otp.utils';
import { ClassConstructor } from 'class-transformer';
import { setToCookie, signToken } from '../handlers/auth.handler';
import { AuthEvents } from './authGateway.strategy';

export const OTP_PASS_STRATEGY = 'otp-pass';
export class OtpPassStrategy extends AuthStrategy {
  private get validation() {
    return (store.globalMiddleware.pipes['validation'] ??
      new CoreValidationPipe()) as CoreValidationPipe;
  }

  private async transform<C>(data: any, metatype: ClassConstructor<C>) {
    const transformed = await this.validation.transform(data, metatype);
    return Object.fromEntries(
      Object.entries(transformed).filter(([k, v]) => !isUndefined(v))
    ) as C;
  }
  private transformDetect(data: any) {
    return this.transform(data, OtpPassStrategyDetect);
  }
  private transformSignup(data: any) {
    return this.transform(data, OtpPassSignup);
  }
  private transformLogin(data: any) {
    return this.transform(data, OtpPassLogin);
  }

  getUserModel(req: Req): UserModel {
    return store.db.model(req.modelName);
  }
  async exportUser(req: Req) {
    if (req.user !== undefined) return req.user;

    const q = ['phone', 'username']
      .filter((k) => req.body.user[k])
      .reduce((prev, k) => {
        prev[k] = req.body.user[k];
        return prev;
      }, {});

    const model = this.getUserModel(req);
    const user: UserDocument = await model.findOne(q, '+password');
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

    // not set password
    console.log('cond', (login || signup) && !isPasswordSet, {
      isPasswordSet,
      login,
    });
    if ((login || signup) && !isPasswordSet) {
      // progress
      return await sendCode(req, res);
    }

    return res.json(req.res_body);
  }

  async login(req: Req, res: Res, next: NextFunction) {
    const userBody = await this.transformLogin(req.body.user);
    const { password, code } = userBody;

    const user = await this.exportUser(req);

    if (!password && !code)
      throw new BadRequestError('code or password must be set');

    const data = await (password
      ? this.loginWithPass(user, password)
      : this.loginWithCode(user, code, req.modelName));

    // cookie
    setToCookie(res, data.token);

    return res.status(200).json({
      data,
    });
  }
  private async loginWithPass(user: UserDocument, password: string) {
    if (!user || !(await user.passwordVerify(password)))
      throw new BadRequestError('phone or password is wrong');

    const outUser: IUser = { ...user.toObject(), password: undefined };

    // sign token
    const token = signToken(outUser);

    // present
    return {
      user: outUser,
      token,
    };
  }

  private async loginWithCode(
    user: UserDocument,
    code: string,
    modelName: string
  ) {
    // verify code
    const [codeDoc, newUser] = await verifyCode(user, code, modelName);

    try {
      // token
      const token = signToken(newUser);

      return {
        user: newUser,
        token,
      };
    } catch (err) {
      await codeRevert(codeDoc);
      throw err;
    }
  }

  async signup(req: Req, res: Res, next: NextFunction) {
    if (req.modelName === 'admin')
      throw new ForbiddenError('can not register admin');

    const user = await this.exportUser(req);
    const safeUser = user?.toObject() ?? {};

    if (user && user.active) throw new BadRequestError('user exists');

    req.body.user = await this.transformSignup(req.body.user);

    const [codeDoc] = await verifyCode(
      { ...safeUser, ...req.body.user },
      req.body.user.code,
      req.modelName
    );

    delete req.body.user.code;

    // create
    const userModel = store.db.model(req.modelName) as UserModel;
    try {
      const newUserDoc = user
        ? await userModel.findByIdAndUpdate(user._id, req.body.user, {
            new: true,
          })
        : await userModel.create(req.body.user);
      const newUser = { ...newUserDoc.toObject(), password: undefined };

      const token = signToken(newUser);
      setToCookie(res, token, 'authToken');

      // emit
      store.event?.emit(AuthEvents.AfterRegister, newUser);

      return res.status(201).json({
        data: {
          user: newUser,
          token,
        },
      });
    } catch (err) {
      await codeRevert(codeDoc);
      throw err;
    }
  }
  strategyId = OTP_PASS_STRATEGY;
}
