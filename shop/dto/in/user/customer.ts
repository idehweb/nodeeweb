import { UserSex } from '@nodeeweb/core/types/user';
import { IsMongoID, ToMongoID } from '@nodeeweb/core/utils/validation';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsString,
  Length,
  IsEmail,
  IsOptional,
  IsMobilePhone,
  isJSON,
  IsObject,
  IsEnum,
  IsBoolean,
  IsPhoneNumber,
  IsDate,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { Address } from '.';

export class CreateCustomerBody {
  @Expose()
  @IsString()
  firstName: string;

  @Expose()
  @IsString()
  lastName: string;

  @Expose()
  @IsString()
  @IsOptional()
  username?: string;

  @Expose()
  @IsString()
  @IsOptional()
  @Length(8, 20)
  password?: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  email?: string;

  @Expose()
  @IsOptional()
  @IsMobilePhone('fa-IR')
  phone?: string;

  @Expose()
  @Transform(({ value }) =>
    value ? (isJSON(value) ? JSON.parse(value) : value) : undefined
  )
  @IsObject()
  @IsOptional()
  data?: any;

  @Expose()
  @IsOptional()
  @IsEnum(UserSex)
  sex?: UserSex;

  @Expose()
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(11, 11)
  internationalCode?: string;

  @Expose()
  @IsOptional()
  @IsString()
  companyName?: string;
  @Expose()
  @IsOptional()
  @IsPhoneNumber('IR')
  companyTelNumber?: string;

  @Expose()
  @IsOptional()
  @IsDate()
  birthday?: Date;

  @Expose()
  @ToMongoID()
  @IsOptional()
  @IsMongoID({ each: true })
  customerGroup?: Types.ObjectId[];

  @Expose()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Address)
  address?: Address[];
}

export class UpdateCustomerBody {
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
  @IsString()
  username?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(8, 20)
  password?: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  email?: string;

  @Expose()
  @IsOptional()
  @IsMobilePhone('fa-IR')
  phone?: string;

  @Expose()
  @Transform(({ value }) =>
    value ? (isJSON(value) ? JSON.parse(value) : value) : undefined
  )
  @IsObject()
  @IsOptional()
  data?: any;

  @Expose()
  @IsOptional()
  @IsEnum(UserSex)
  sex?: UserSex;

  @Expose()
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(11, 11)
  internationalCode?: string;

  @Expose()
  @IsOptional()
  @IsString()
  companyName?: string;

  @Expose()
  @IsOptional()
  @IsPhoneNumber('IR')
  companyTelNumber?: string;

  @Expose()
  @IsOptional()
  @IsDate()
  birthday?: Date;

  @Expose()
  @IsOptional()
  @ToMongoID()
  @IsMongoID({ each: true })
  customerGroup?: Types.ObjectId[];

  @Expose()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Address)
  address?: Address[];
}
