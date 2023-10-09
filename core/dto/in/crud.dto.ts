import { IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { ToMongoID, IsMongoID, IsSlug } from '../../utils/validation';
import { Expose, Transform } from 'class-transformer';
import { Allow, isMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { isSlug } from '../../utils/validation';
import { ValidationError } from '../../types/error';

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

export class MultiIDParam {
  @Expose()
  @Transform(({ obj }) => {
    const value = obj.id;
    if (!isMongoId(value) && !isSlug(value))
      throw new ValidationError(
        `this parameter must be valid mongo id or slug format, ${value}`
      );
    if (isMongoId(value)) return new Types.ObjectId(value);
  })
  @Allow()
  id?: Types.ObjectId;

  @Expose()
  @Transform(({ obj }) => {
    const value = obj.id;
    if (isSlug(value) && !isMongoId(value)) return value;
  })
  @Allow()
  slug?: string;
}
