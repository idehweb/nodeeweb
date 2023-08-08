import { Expose, Type } from 'class-transformer';
import { IsMultiLang } from '../../../utils/validation';
import {
  Allow,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ToID } from '@nodeeweb/core/utils/validation';
import { Types } from 'mongoose';
import { PriceType } from '../../../schema/product.schema';
import { PublishStatus } from '../../../schema/_base.schema';

class ExtraAtr {
  @Expose()
  @IsString()
  title: string;

  @Expose()
  @IsString()
  des: string;
}
class Labels {
  @Expose()
  @IsString()
  title: string;
}
class Attributes {
  @Expose()
  @ToID()
  @IsMongoId()
  attribute: Types.ObjectId;

  @Expose()
  @IsString({ each: true })
  values: string[];
}

class OptionValueProduct {
  @Expose()
  @IsString()
  name: string;
}
class OptionProduct {
  @Expose()
  @IsString()
  _id: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @Type(() => OptionValueProduct)
  @ValidateNested({ each: true })
  values: OptionProduct[];
}

class CombinationProduct {
  @Expose()
  @IsOptional()
  @IsMultiLang()
  options?: { [key: string]: string };

  @Expose()
  @IsNumber()
  @IsPositive()
  price: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  salePrice?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  weight?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  quantity?: number;

  @Expose()
  @IsOptional()
  @IsBoolean()
  in_stock?: boolean;

  @Expose()
  @IsOptional()
  @IsString()
  sku?: string;
}

export class CreateProductBody {
  @Expose()
  @IsMultiLang()
  title: { [key: string]: string };

  @Expose()
  @IsMultiLang()
  miniTitle: { [key: string]: string };

  @Expose()
  @IsOptional()
  @IsMultiLang()
  metatitle?: { [key: string]: string };

  @Expose()
  @IsOptional()
  @IsMultiLang()
  metadescription?: { [key: string]: string };

  @Expose()
  @IsString()
  slug: string;

  @Expose()
  @IsOptional()
  @IsMultiLang()
  excerpt?: { [key: string]: string };

  @Expose()
  @IsOptional()
  @IsMultiLang()
  description?: { [key: string]: string };

  @Expose()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => CombinationProduct)
  @ValidateNested({ each: true })
  combinations: CombinationProduct[];

  @Expose()
  @Type(() => OptionProduct)
  @ValidateNested({ each: true })
  options: OptionProduct[];

  @Expose()
  @IsOptional()
  @ToID()
  @IsMongoId({ each: true })
  productCategory?: Types.ObjectId[];

  @Expose()
  @Type(() => Attributes)
  @ValidateNested({ each: true })
  attributes: Attributes[];

  @Expose()
  @Type(() => Labels)
  @ValidateNested({ each: true })
  labels: Labels[];

  @Expose()
  @IsOptional()
  @IsObject()
  data?: any;

  @Expose()
  @Type(() => ExtraAtr)
  @ValidateNested({ each: true })
  extra_attr: ExtraAtr[];

  @Expose()
  @IsEnum(PriceType)
  price_type: PriceType;

  @Expose()
  @IsEnum(PublishStatus)
  status: PublishStatus;

  @Expose()
  @IsOptional()
  @ToID()
  @IsMongoId({ each: true })
  relatedProducts?: Types.ObjectId[];

  @Expose()
  @IsOptional()
  @ToID()
  @IsMongoId({ each: true })
  photos?: Types.ObjectId[];

  @Expose()
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
