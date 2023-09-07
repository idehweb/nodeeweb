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
  @IsString()
  firstName: string;

  @Expose()
  @IsString()
  lastName: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class OtpUserDetect {
  @Expose()
  @IsMobilePhone('fa-IR')
  phone: string;
}
export class OtpUserLogin {
  @Expose()
  @IsMobilePhone('fa-IR')
  phone: string;

  @Expose()
  @IsString()
  code: string;
}
export class OtpUserSignup {
  @Expose()
  @IsMobilePhone('fa-IR')
  phone: string;

  @Expose()
  @IsString()
  code: string;

  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsString()
  firstName: string;

  @Expose()
  @IsString()
  lastName: string;
}
