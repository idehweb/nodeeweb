import { Expose, Transform, Type } from 'class-transformer';
import {
  Allow,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPositive,
  isMongoId,
} from 'class-validator';
import { Types } from 'mongoose';
import { ToID } from '../../utils/validation';

export class CrudParamDto {
  @Expose()
  @ToID()
  @IsOptional()
  @IsMongoId()
  id?: Types.ObjectId;

  @Expose()
  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  offset?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  limit?: number;
}
