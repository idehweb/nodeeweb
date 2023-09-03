import { NextFunction } from 'express';
import { AuthStrategy } from '../../types/auth';
import { Req, Res } from '../../types/global';
import store from '../../store';
import {
  ErrorType,
  ForbiddenError,
  GeneralError,
  NotFound,
  NotImplement,
  SendSMSError,
  UnauthorizedError,
} from '../../types/error';
import {
  CorePluginType,
  SMSPluginContent,
  SMSPluginType,
  SmsSendStatus,
} from '../../types/plugin';
import randomNumber from 'random-number-csprng';
import { setToCookie, signToken } from '../handlers/auth.handler';
import { Document, Model } from 'mongoose';
import { CoreValidationPipe } from '../core/validate';
import {
  OtpUserDetect,
  OtpUserLogin,
  OtpUserSignup,
} from '../../dto/in/auth/index.dto';
import { UserDocument, UserModel } from '../../types/user';
import { replaceValue } from '../../utils/helpers';
import { AuthEvents } from './authGateway.strategy';
import { SmsSubType } from '../../types/config';

export const OTP_STRATEGY = 'otp';
export class OtpStrategy extends AuthStrategy {
  strategyId = OTP_STRATEGY;

  private get validation() {
    return (store.globalMiddleware.pipes['validation'] ??
      new CoreValidationPipe()) as CoreValidationPipe;
  }

  private transformDetect(body: any) {
    return this.validation.transform(body, OtpUserDetect);
  }
  private transformLogin(body: any) {
    return this.validation.transform(body, OtpUserLogin);
  }
  private transformSignup(body: any) {
    return this.validation.transform(body, OtpUserSignup);
  }

  private async exportUser(req: Req, throwOnNotfound = true) {
    if (req.user) return req.user;

    const { phone } = req.body.user as OtpUserDetect;

    const model = store.db.model(req.modelName);
    const user: UserDocument = await model.findOne({ phone });
    if (!user && throwOnNotfound)
      throw new NotFound(
        `did'nt find any user with ${phone} number, please signup`
      );
    if (user && !user.active) throw new ForbiddenError('inactive user');

    req.user = user;
    return user;
  }

  private async verify(phone: string, code: string) {
    const otpModel = store.db.model('otp');

    const codeDoc = await otpModel.findOneAndUpdate(
      {
        phone,
        code,
        updatedAt: { $gt: new Date(Date.now() - 120 * 1000) },
      },
      { $unset: { code: '' } }
    );

    if (!codeDoc) throw new UnauthorizedError();
    return codeDoc;
  }
  private async codeRevert(codeDoc: Document) {
    await codeDoc.updateOne({ ...codeDoc.toObject() }, { timestamps: false });
  }

  private async sendCode(req: Req, res: Res) {
    // generate and send code

    const phone = req.user?.phone ?? req.body.user?.phone,
      userExists = Boolean(req.user);

    // send code
    const smsPlugin = store.plugins.get(CorePluginType.SMS) as SMSPluginContent;
    if (!smsPlugin) throw new NotImplement('sms plugin not found');

    // save to db
    const otpModel = store.db.model('otp');
    //check if sms send before :
    const prevCode = await otpModel.findOne({
      phone,
      updatedAt: { $gt: new Date(Date.now() - 120 * 1000) },
    });
    if (prevCode) {
      const leftTimeMs = prevCode.updatedAt.getTime() + 120 * 1000 - Date.now();
      return res.json({
        type: SmsSendStatus.Send_Before,
        message: `sms send at ${prevCode.updatedAt}`,
        data: {
          userExists,
          leftTime: {
            milliseconds: leftTimeMs,
            seconds: Math.ceil(leftTimeMs / 1000),
          },
        },
      });
    }

    const code = (
      await Promise.all(new Array(5).fill(0).map(() => randomNumber(0, 9)))
    ).join('');

    // create
    await otpModel.findOneAndUpdate(
      { phone },
      { code },
      { new: true, upsert: true }
    );

    // send code
    let codeResult: string | boolean;
    try {
      const response = await smsPlugin.stack[0]({
        to: phone,
        type: SMSPluginType.Automatic,
        subType: SmsSubType.OTP,
        text: replaceValue({
          data: [store.config.toObject(), { code }],
          text: store.config.sms_message_on.otp,
        }),
      });
      if (response.status === SmsSendStatus.Send_Success) codeResult = true;
    } catch (err) {
      codeResult = err.message;
    }

    if (codeResult !== true) {
      // revert changes
      await otpModel.findOneAndDelete({ phone });
      throw new SendSMSError(codeResult);
    }

    return res.json({
      type: SmsSendStatus.Send_Success,
      message: `sms send at ${new Date().toISOString()}`,
      data: {
        userExists,
        leftTime: {
          milliseconds: 120_000,
          seconds: 120,
        },
      },
    });
  }

  async detect(req: Req, res: Res, next: NextFunction) {
    req.body.user = await this.transformDetect(req.body.user);

    const { login, signup } = req.body;

    // export user
    await this.exportUser(req, !signup && login);

    if (login || signup) {
      // progress
      return await this.sendCode(req, res);
    }

    return res.json({ data: { userExists: Boolean(req.user) } });
  }
  async login(req: Req, res: Res) {
    req.body.user = await this.transformLogin(req.body.user);

    const user = await this.exportUser(req);

    // verify code
    await this.verify(user.phone, req.body.user.code);

    // token
    const token = signToken(user);
    setToCookie(res, token, 'authToken');

    return res.json({
      data: {
        user,
        token,
      },
    });
  }

  async signup(req: Req, res: Res, next: NextFunction) {
    req.body.user = await this.transformSignup(req.body.user);

    const codeDoc = await this.verify(req.body.user.phone, req.body.user.code);

    delete req.body.user.code;

    // create
    const userModel = store.db.model(req.modelName) as UserModel;
    try {
      const user = await userModel.create(req.body.user);
      const token = signToken(user);
      setToCookie(res, token, 'authToken');

      // emit
      store.event?.emit(AuthEvents.AfterRegister, user);

      return res.status(201).json({
        data: {
          user,
          token,
        },
      });
    } catch (err) {
      await this.codeRevert(codeDoc);
      throw err;
    }
  }
}
