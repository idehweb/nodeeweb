import { ValidationError } from '@nodeeweb/core';
import { IsMongoID, ToMongoID } from '@nodeeweb/core/utils/validation';
import { Expose, Transform, Type } from 'class-transformer';
import {
  Allow,
  ArrayUnique,
  IsInt,
  IsMongoId,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import store from '../../../store';

class ProductCombinations {
  @Expose()
  @IsString()
  _id: string;

  @Expose()
  @IsNumber()
  @IsPositive()
  @IsInt()
  @Transform(({ value }) => {
    const maxComQua =
      store.config.limit.max_product_combination_quantity_in_cart;
    const q = +value;

    if (q > maxComQua)
      throw new ValidationError(
        `every product combination quantity must be equal or less than ${maxComQua}`
      );
    return q;
  })
  quantity: number;
}

export class ProductBody {
  @Expose()
  @ToMongoID()
  @IsMongoID()
  _id: Types.ObjectId;

  @Expose()
  @Type(() => ProductCombinations)
  @ValidateNested({ each: true })
  combinations: ProductCombinations[];
}

export class AddToCartBody {
  @Expose()
  @Type(() => ProductBody)
  @ArrayUnique<ProductBody>((product) => product._id.toString())
  @ValidateNested({ each: true })
  products: ProductBody[];
}

export class UpdateCartBody extends AddToCartBody {}
