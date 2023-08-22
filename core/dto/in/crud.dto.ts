import { Expose } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { Types } from 'mongoose';
import { ToMongoID, IsMongoID, IsSlug } from '../../utils/validation';

export class CrudParamDto {
  @Expose()
  @ToMongoID()
  @IsOptional()
  @IsMongoID()
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

  @Expose()
  @IsOptional()
  @IsSlug()
  slug?: string;
}
