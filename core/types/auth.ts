import mongoose, { Model, Types } from 'mongoose';
import { MiddleWare, Req, Res } from './global';
import { NextFunction } from 'express';
import { Document } from 'mongoose';

export abstract class AuthStrategy {
  abstract detect(req: Req, res: Res, next: NextFunction): any;
  abstract login(req: Req, res: Res, next: NextFunction): any;
  abstract signup(req: Req, res: Res, next: NextFunction): any;
  abstract strategyId: string;
}

export interface IUserMethods {
  passwordVerify: (password: string) => Promise<boolean>;
}

export interface IUser {
  email?: string;
  username?: string;
  password?: string;
  phone?: string;
  active: boolean;
}

export type UserModel = Model<IUser, {}, IUserMethods>;
export type UserDocument = Document<unknown, {}, IUser> &
  Omit<
    IUser & {
      _id: Types.ObjectId;
    },
    'passwordVerify'
  > &
  IUserMethods;
