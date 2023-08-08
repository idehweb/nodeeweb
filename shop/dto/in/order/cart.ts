import { ValidationError, store } from '@nodeeweb/core';
import { ToID } from '@nodeeweb/core/utils/validation';
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

class ProductCombinations {
  @Expose()
  @IsString()
  _id: string;

  @Expose()
  @IsNumber()
  @IsPositive()
  @IsInt()
  @Transform(({ value }) => {
    const q = +value;
    if (q > store.settings.MAX_PRODUCT_QUANTITY_IN_CART)
      throw new ValidationError(
        `quantity must be less than ${store.settings.MAX_PRODUCT_QUANTITY_IN_CART}`
      );
    return q;
  })
  quantity: number;
}

export class ProductBody {
  @Expose()
  @ToID()
  @Allow()
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
