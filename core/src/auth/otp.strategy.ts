import { NextFunction } from 'express';
import { AuthStrategy, UserDocument, UserModel } from '../../types/auth';
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
  PluginType,
  SMSPluginContent,
  SMSPluginType,
} from '../../types/plugin';
import randomNumber from 'random-number-csprng';
import { setToCookie, signToken } from '../handlers/auth.handler';
import { Document, Model } from 'mongoose';

export enum SmsSendType {
  Send_Before = 'send_before',
  Send_Success = 'send_success',
}

export const OTP_STRATEGY = 'otp';
export class OtpStrategy extends AuthStrategy {
  strategyId = OTP_STRATEGY;
  async findUser(req: Req, throwOnNotfound = true) {
    const { phone } = req.body;
    const model = store.db.model(req.modelName);
    const user: UserDocument = await model.findOne({ phone });
    if (!user && throwOnNotfound)
      throw new NotFound(
        `did'nt find any user with ${phone} number, please signup`
      );
    if (user && !user.active) throw new ForbiddenError('inactive user');
    return user;
  }

  async verify(phone: string, code: string) {
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
  async codeRevert(codeDoc: Document) {
    await codeDoc.updateOne({ ...codeDoc.toObject() }, { timestamps: false });
  }

  async detect(req: Req, res: Res, next: NextFunction) {
    const user = await this.findUser(req, false);
    const phone = user?.phone ?? req.body.phone,
      userExists = Boolean(user);

    // send code
    const smsPlugin = store.plugins.get(PluginType.SMS) as SMSPluginContent;
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
        type: SmsSendType.Send_Before,
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
      codeResult = await smsPlugin.stack[0]({
        to: phone,
        type: SMSPluginType.OTP,
        text: `your code is: ${code}`,
      });
    } catch (err) {
      codeResult = err.message;
    }

    if (codeResult !== true) {
      // revert changes
      await otpModel.findOneAndDelete({ phone });
      throw new SendSMSError(codeResult);
    }

    return res.json({
      type: SmsSendType.Send_Success,
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
  async login(req: Req, res: Res) {
    const user = await this.findUser(req);

    // verify code
    await this.verify(user.phone, req.body.code);

    // token
    const token = signToken(user.id);
    setToCookie(res, token, 'authToken');

    return res.json({
      data: {
        user,
        token,
      },
    });
  }

  async signup(req: Req, res: Res, next: NextFunction) {
    const codeDoc = await this.verify(req.body.phone, req.body.code);

    delete req.body.code;

    // create
    const userModel = store.db.model(req.modelName);
    try {
      const user = await userModel.create(req.body);
      const token = signToken(user.id);
      setToCookie(res, token, 'authToken');

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

    // token
  }
}
