import { ValidationError, extractToken } from '@nodeeweb/core';
import { IsMongoID, ToMongoID } from '@nodeeweb/core/utils/validation';
import { Expose, Transform, Type } from 'class-transformer';
import {
  Allow,
  ArrayUnique,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import store from '../../../store';

class ProductCombination {
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
  @Type(() => ProductCombination)
  @ValidateNested({ each: true })
  combinations: ProductCombination[];
}

export class AddToCartBody {
  @Expose()
  @Type(() => ProductBody)
  @ArrayUnique<ProductBody>((product) => product._id.toString())
  @ValidateNested({ each: true })
  products: ProductBody[];
}

export class UpdateCartBody extends AddToCartBody {}
export class ModifyCombBody extends ProductCombination {
  @IsOptional()
  _id: string;
}
export class ModifyCombParam {
  @Expose()
  @ToMongoID()
  @IsMongoID()
  productId: Types.ObjectId;

  @Expose()
  @IsString()
  combId: string;
}

export class DeleteCombParam extends ModifyCombParam {}
