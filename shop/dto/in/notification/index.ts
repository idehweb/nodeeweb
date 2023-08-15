import { IsMongoID, ToMongoID } from '@nodeeweb/core/utils/validation';
import { Expose } from 'class-transformer';
import { IsEnum, IsMobilePhone, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { CustomerSource } from '../../../schema/customer.schema';

export class CreateNotification {
  @Expose()
  @IsString()
  title: string;

  @Expose()
  @IsOptional()
  @ToMongoID()
  @IsMongoID()
  customerGroup?: Types.ObjectId;

  @Expose()
  @IsOptional()
  @IsEnum(CustomerSource)
  source?: CustomerSource;

  @Expose()
  @IsOptional()
  @IsMobilePhone('fa-IR')
  phone?: string;

  @Expose()
  @IsString()
  message: string;
}
