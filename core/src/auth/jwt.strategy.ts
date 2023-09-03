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
import {
  authWithToken,
  extractToken,
  setToCookie,
  signToken,
  verifyToken,
} from '../handlers/auth.handler';
import { Document, Model } from 'mongoose';
import { CoreValidationPipe } from '../core/validate';

export const JWT_STRATEGY = 'jwt';
export class JwtStrategy extends AuthStrategy {
  strategyId = JWT_STRATEGY;

  private get validation() {
    return (store.globalMiddleware.pipes['validation'] ??
      new CoreValidationPipe()) as CoreValidationPipe;
  }

  async detect(req: Req, res: Res, next: NextFunction) {
    return this.login(req, res);
  }
  async login(req: Req, res: Res) {
    const onResponse = (isError?: any) => {
      if (isError) throw isError;
      return res.json({ data: { user: req.user } });
    };
    return authWithToken({ model: req.modelName, name: 'jwt' })(
      req,
      res,
      onResponse
    );
  }
  signup(req: Req, res: Res, next: NextFunction) {
    return next();
  }
}
