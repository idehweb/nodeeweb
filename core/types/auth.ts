import { Req, Res } from './global';
import { NextFunction } from 'express';

export abstract class AuthStrategy {
  abstract detect(req: Req, res: Res, next: NextFunction): any;
  abstract login(req: Req, res: Res, next: NextFunction): any;
  abstract signup(req: Req, res: Res, next: NextFunction): any;
  abstract strategyId: string;
}
