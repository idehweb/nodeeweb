import mongoose, { Model, Types, Document } from 'mongoose';

export interface IUserMethods {
  passwordVerify: (password: string) => Promise<boolean>;
}

export enum UserSex {
  Male = 'male',
  Female = 'female',
}

export interface IUser {
  _id: Types.ObjectId;
  id?: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  phone?: string;
  role: string;
  type: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  passwordChangeAt?: Date;
  credentialChangeAt: Date;
  sex?: UserSex;
  data: any;
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
