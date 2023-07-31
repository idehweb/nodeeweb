import { Expose } from 'class-transformer';
import {
  Allow,
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
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
  @IsObject()
  user: any;
}
