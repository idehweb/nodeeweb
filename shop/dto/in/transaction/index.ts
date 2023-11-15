import { IsMongoID, ToMongoID } from '@nodeeweb/core/utils/validation';
import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import {
  TransactionCreator,
  TransactionStatus,
} from '../../../schema/transaction.schema';
import { Currency } from '../../config';

export class TransactionPayer {
  @Expose()
  @ToMongoID()
  @IsMongoID()
  _id: Types.ObjectId;

  @Expose()
  @IsIn(['admin', 'customer'])
  type: 'admin' | 'customer';
}

export class TransactionCreateBody {
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => TransactionPayer)
  payer?: TransactionPayer;

  @Expose()
  @IsOptional()
  @IsString()
  order?: string;

  @Expose()
  @IsNumber()
  amount: number;

  @Expose()
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

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

  creator_category: TransactionCreator;
}
export class TransactionUpdateBody {
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => TransactionPayer)
  payer?: TransactionPayer;

  @Expose()
  @IsOptional()
  @IsString()
  order?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  amount?: number;

  @Expose()
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

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
