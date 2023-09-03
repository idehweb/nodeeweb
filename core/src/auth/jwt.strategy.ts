import { NextFunction } from 'express';
import { AuthStrategy } from '../../types/auth';
import { Req, Res } from '../../types/global';
import { authWithToken } from '../handlers/auth.handler';

export const JWT_STRATEGY = 'jwt';
export class JwtStrategy extends AuthStrategy {
  strategyId = JWT_STRATEGY;

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
