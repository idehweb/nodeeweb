import { NextFunction } from 'express';
import { AuthStrategy } from '../../types/auth';
import { MiddleWare, Req, Res } from '../../types/global';
import store from '../../store';
import { catchFn } from '../../utils/catchAsync';
import { sendSms } from './sms.service';
import { SMSPluginType } from '../../types/plugin';
import logger from '../handlers/log.handler';
import { axiosError2String } from '../../utils/helpers';

export default class AuthGatewayStrategy extends AuthStrategy {
  strategyId: string;
  exportModelName(req: Req) {
    if (req.modelName) return req.modelName;
    req.modelName = String(req.body.userType);
    return req.modelName;
  }

  getStrategy(req: Req) {
    return store.strategies.get(req.params.strategyId);
  }
  detect(req: Req, res: Res, next: NextFunction) {
    this.exportModelName(req);
    const strategy = this.getStrategy(req);
    if (!strategy) return next();
    return strategy.detect(req, res, next);
  }
  login(req: Req, res: Res, next: NextFunction) {
    this.exportModelName(req);
    const strategy = this.getStrategy(req);
    if (!strategy) return next();
    return strategy.login(req, res, next);
  }
  signup(req: Req, res: Res, next: NextFunction) {
    this.exportModelName(req);
    const strategy = this.getStrategy(req);
    if (!strategy) return next();
    return strategy.signup(req, res, next);
  }

  registerSMS: MiddleWare = (req, res, next) => {
    if (!req.data) return next();
    const registerText = store.config.sms_message_on.register;
    if (registerText && req.data.user?.phoneNumber) {
      catchFn(
        sendSms.bind(null, {
          to: req.data.user.phoneNumber,
          type: SMSPluginType.Reg,
          text: registerText,
        })
      );
    }
    return res.status(201).json(req.data);
  };
}
