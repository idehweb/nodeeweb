import { Expose } from 'class-transformer';
import {
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { Types } from 'mongoose';

export class CrudParamDto {
  @Expose()
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
