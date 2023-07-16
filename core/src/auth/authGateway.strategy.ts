import { NextFunction } from 'express';
import { AuthStrategy } from '../../types/auth';
import { Req, Res } from '../../types/global';
import store from '../../store';

export default class AuthGatewayStrategy extends AuthStrategy {
  strategyId: string;

  getStrategy(req: Req) {
    return store.strategies.get(req.params.strategyId);
  }
  detect(req: Req, res: Res, next: NextFunction) {
    const strategy = this.getStrategy(req);
    if (!strategy) return next();
    return strategy.detect(req, res, next);
  }
  login(req: Req, res: Res, next: NextFunction) {
    const strategy = this.getStrategy(req);
    if (!strategy) return next();
    return strategy.login(req, res, next);
  }
  signup(req: Req, res: Res, next: NextFunction) {
    const strategy = this.getStrategy(req);
    if (!strategy) return next();
    return strategy.signup(req, res, next);
  }
}
