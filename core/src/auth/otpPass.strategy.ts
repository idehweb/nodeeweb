import { NextFunction } from 'express';
import { AuthStrategy } from '../../types/auth';
import { Req, Res } from '../../types/global';
import store from '../../store';
import { OtpPassStrategyDetect } from '../../dto/in/auth/index.dto';
import { UserDocument, UserModel } from '../../types/user';
import { CoreValidationPipe } from '../core/validate';
import { isUndefined } from 'lodash';

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
    const user: UserDocument = await model.findOne(req.body.user);
    req.user = user;

    return user;
  }

  async detect(req: Req, res: Res, next: NextFunction) {
    // transform user data
    req.body.user = await this.transformDetect(req.body.user ?? {});

    const userDoc = await this.exportUser(req);
    return res.json({
      data: {
        userExists: Boolean(userDoc),
        ...(userDoc
          ? {
              isPasswordSet: Boolean(userDoc.password),
              isPhoneSet: Boolean(userDoc.phone),
            }
          : {}),
      },
    });
  }

  async login(req: Req, res: Res, next: NextFunction) {
    return next();
  }

  async signup(req: Req, res: Res, next: NextFunction) {
    return next();
  }
  strategyId = OTP_PASS_STRATEGY;
}
