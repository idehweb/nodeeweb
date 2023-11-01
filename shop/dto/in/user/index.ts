import { ToMongoID } from '@nodeeweb/core/utils/validation';
import { Expose, Transform } from 'class-transformer';
import { IsString, IsOptional, IsObject, IsPostalCode } from 'class-validator';
import { Types } from 'mongoose';
import { IsProfileId } from './val';

export class Address {
  @Expose()
  @IsString()
  state: string;

  @Expose()
  @IsString()
  city: string;

  @Expose()
  @IsString()
  street: string;

  @Expose()
  @IsPostalCode('IR')
  postalCode: string;

  @Expose()
  @Transform(({ obj, key }) => obj[key])
  @IsOptional()
  @IsObject()
  receiver?: any;
}
export class UserParamVal {
  @Expose()
  @ToMongoID()
  @IsProfileId()
  id: string | Types.ObjectId;
}
