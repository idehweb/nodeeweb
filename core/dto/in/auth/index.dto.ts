import { Expose, Transform, Type } from 'class-transformer';
import {
  Allow,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { normalizePhone } from '../../../utils/helpers';

export enum AuthUserType {
  Customer = 'customer',
  Admin = 'admin',
}

export class AuthStrategyBody {
  @Expose()
  @IsEnum(AuthUserType)
  userType: AuthUserType;

  @Expose()
  @IsOptional()
  @IsBoolean()
  signup?: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  login?: boolean;

  @Expose()
  @IsOptional()
  @IsObject()
  @Transform(({ obj, key }) => obj[key])
  user?: any;
}

export class UserPassUserLogin {
  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsString()
  password: string;
}
export class UserPassUserSignup {
  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsString()
  @Length(8)
  password: string;

  @Expose()
  @IsOptional()
  @IsString()
  firstName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  lastName?: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class OtpUserDetect {
  @Expose()
  @IsMobilePhone('fa-IR')
  @Transform(({ value }) => normalizePhone(value))
  phone: string;
}
export class OtpUserLogin {
  @Expose()
  @IsMobilePhone('fa-IR')
  @Transform(({ value }) => normalizePhone(value))
  phone: string;

  @Expose()
  @IsString()
  code: string;
}
export class OtpUserSignup {
  @Expose()
  @Transform(({ value }) => normalizePhone(value))
  @IsMobilePhone('fa-IR')
  phone: string;

  @Expose()
  @IsString()
  code: string;

  @Expose()
  @IsOptional()
  @IsString()
  username?: string;

  @Expose()
  @IsOptional()
  @IsString()
  firstName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  lastName?: string;
}

export class OtpPassStrategyDetect {
  @Expose()
  @IsOptional()
  @IsString()
  username?: string;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => normalizePhone(value))
  @IsMobilePhone('fa-IR')
  phone?: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class OtpPassSignup {
  @Expose()
  @Transform(({ value }) => normalizePhone(value))
  @IsMobilePhone('fa-IR')
  phone: string;

  @Expose()
  @IsString()
  code: string;

  @Expose()
  @IsString()
  @Length(8, 20)
  password: string;

  @Expose()
  @IsOptional()
  @IsString()
  username?: string;

  @Expose()
  @IsOptional()
  @IsString()
  firstName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  lastName?: string;
}

export class OtpPassLogin {
  @Expose()
  @Transform(({ value }) => normalizePhone(value))
  @IsMobilePhone('fa-IR')
  phone: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(8, 20)
  password?: string;

  @Expose()
  @IsOptional()
  @IsString()
  code?: string;
}
