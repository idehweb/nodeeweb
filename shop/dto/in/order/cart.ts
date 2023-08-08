import { store } from '@nodeeweb/core';
import { Expose, Transform } from 'class-transformer';
import {
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

class ProductDetails {
  @Expose()
  @IsString()
  _id: string;

  @Expose()
  @IsNumber()
  @IsPositive()
  @IsInt()
  @Max(store.settings.MAX_PRODUCT_QUANTITY_IN_CART)
  quantity: number;
}

export class ProductBody {
  @Expose()
  @IsMongoId()
  _id: Types.ObjectId;

  @Expose()
  @Transform(() => ProductDetails)
  @ValidateNested({ each: true })
  details: ProductDetails[];
}

export class AddToCartBody {
  @Expose()
  @Transform(() => ProductBody)
  @ArrayUnique((product: ProductBody) => product._id.toString())
  @ValidateNested({ each: true })
  products: ProductBody[];
}

export class UpdateCartBody extends AddToCartBody {}
