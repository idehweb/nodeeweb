import mongoose, { Model, Types, Document } from 'mongoose';

export interface IUserMethods {
  passwordVerify: (password: string) => Promise<boolean>;
}

export enum UserSex {
  Male = 'male',
  Female = 'female',
}

export interface IUser {
  email?: string;
  username?: string;
  password?: string;
  phone?: string;
  active: boolean;
  role: string;
  firstName: string;
  lastName: string;
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
