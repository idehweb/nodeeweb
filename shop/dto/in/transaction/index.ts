import { IsMongoID, ToMongoID } from '@nodeeweb/core/utils/validation';
import { Expose } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { TransactionStatus } from '../../../schema/transaction.schema';

export class TransactionCreateBody {
  @Expose()
  @IsOptional()
  @ToMongoID()
  @IsMongoID()
  consumer?: Types.ObjectId;

  @Expose()
  @IsOptional()
  @ToMongoID()
  @IsMongoID()
  order?: Types.ObjectId;

  @Expose()
  @IsNumber()
  amount: number;

  @Expose()
  @IsOptional()
  @IsString()
  currency?: string;

  @Expose()
  @IsOptional()
  @IsString()
  provider?: string;

  @Expose()
  @IsOptional()
  @IsString()
  authority?: string;

  @Expose()
  @IsOptional()
  @IsString()
  payment_link?: string;

  @Expose()
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @Expose()
  @IsOptional()
  @IsDate()
  expiredAt?: Date;
}
export class TransactionUpdateBody {
  @Expose()
  @IsOptional()
  @ToMongoID()
  @IsMongoID()
  consumer?: Types.ObjectId;

  @Expose()
  @IsOptional()
  @ToMongoID()
  @IsMongoID()
  order?: Types.ObjectId;

  @Expose()
  @IsOptional()
  @IsNumber()
  amount?: number;

  @Expose()
  @IsOptional()
  @IsString()
  currency?: string;

  @Expose()
  @IsOptional()
  @IsString()
  provider?: string;

  @Expose()
  @IsOptional()
  @IsString()
  authority?: string;

  @Expose()
  @IsOptional()
  @IsString()
  payment_link?: string;

  @Expose()
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @Expose()
  @IsOptional()
  @IsDate()
  expiredAt?: Date;
}
