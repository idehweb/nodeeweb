import { Expose, Transform, Type } from 'class-transformer';
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
  Min,
  ValidateNested,
} from 'class-validator';
import { IsMongoID, ToMongoID } from '@nodeeweb/core/utils/validation';
import { Types } from 'mongoose';
import { PriceType } from '../../../schema/product.schema';
import { PublishStatus } from '../../../schema/_base.schema';
import { ToObject } from '@nodeeweb/core/utils/transform';

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
  @ToMongoID()
  @IsMongoID()
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
  @ToObject()
  options?: { [key: string]: string };

  @Expose()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

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
  @IsOptional()
  @IsNumber()
  @Min(0)
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
  @IsOptional()
  @IsMultiLang()
  @ToObject()
  title?: { [key: string]: string };

  @Expose()
  @IsMultiLang()
  @IsOptional()
  @ToObject()
  miniTitle?: { [key: string]: string };

  @Expose()
  @IsOptional()
  @IsMultiLang()
  @ToObject()
  metatitle?: { [key: string]: string };

  @Expose()
  @IsOptional()
  @IsMultiLang()
  @ToObject()
  metadescription?: { [key: string]: string };

  @Expose()
  @IsString()
  slug: string;

  @Expose()
  @IsOptional()
  @IsMultiLang()
  @ToObject()
  excerpt?: { [key: string]: string };

  @Expose()
  @IsOptional()
  @IsMultiLang()
  @ToObject()
  description?: { [key: string]: string };

  @Expose()
  @IsOptional()
  @Transform(({ value }) => value ?? [])
  @IsArray()
  // @ArrayMinSize(1)
  @Type(() => CombinationProduct)
  @ValidateNested({ each: true })
  combinations?: CombinationProduct[];

  @Expose()
  @Transform(({ value }) => value ?? [])
  @IsOptional()
  @Type(() => OptionProduct)
  @ValidateNested({ each: true })
  options?: OptionProduct[];

  @Expose()
  @Transform(({ value }) => value ?? [])
  @IsOptional()
  @ToMongoID()
  @IsMongoID({ each: true })
  productCategory?: Types.ObjectId[];

  @Expose()
  @IsOptional()
  @Transform(({ value }) => value ?? [])
  @Type(() => Attributes)
  @ValidateNested({ each: true })
  attributes?: Attributes[];

  @Expose()
  @IsOptional()
  @Type(() => Labels)
  @ValidateNested({ each: true })
  labels?: Labels[];

  @Expose()
  @IsOptional()
  @ToObject()
  @IsObject()
  data?: any;

  @Expose()
  @IsOptional()
  @Type(() => ExtraAtr)
  @ValidateNested({ each: true })
  extra_attr?: ExtraAtr[];

  @Expose()
  @IsOptional()
  @IsEnum(PriceType)
  price_type?: PriceType;

  @Expose()
  @IsOptional()
  @IsEnum(PublishStatus)
  status?: PublishStatus;

  @Expose()
  @ToMongoID()
  @IsOptional()
  @IsMongoID({ each: true })
  relatedProducts?: Types.ObjectId[];

  @Expose()
  @IsOptional()
  @ToMongoID()
  @IsMongoID({ each: true })
  @ArrayMinSize(1)
  photos?: Types.ObjectId[];

  @Expose()
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateProductBody {
  @Expose()
  @IsMultiLang()
  @IsOptional()
  @ToObject()
  title?: { [key: string]: string };

  @Expose()
  @IsMultiLang()
  @ToObject()
  @IsOptional()
  miniTitle?: { [key: string]: string };

  @Expose()
  @IsOptional()
  @IsMultiLang()
  @ToObject()
  metatitle?: { [key: string]: string };

  @Expose()
  @IsOptional()
  @IsMultiLang()
  @ToObject()
  metadescription?: { [key: string]: string };

  @Expose()
  @IsString()
  @IsOptional()
  slug?: string;

  @Expose()
  @IsOptional()
  @IsMultiLang()
  @ToObject()
  excerpt?: { [key: string]: string };

  @Expose()
  @IsOptional()
  @IsMultiLang()
  @ToObject()
  description?: { [key: string]: string };

  @Expose()
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => CombinationProduct)
  @ValidateNested({ each: true })
  combinations?: CombinationProduct[];

  @Expose()
  @IsOptional()
  @Type(() => OptionProduct)
  @ValidateNested({ each: true })
  options?: OptionProduct[];

  @Expose()
  @IsOptional()
  @ToMongoID()
  @IsMongoID({ each: true })
  productCategory?: Types.ObjectId[];

  @Expose()
  @IsOptional()
  @Type(() => Attributes)
  @ValidateNested({ each: true })
  attributes?: Attributes[];

  @Expose()
  @IsOptional()
  @Type(() => Labels)
  @ValidateNested({ each: true })
  labels?: Labels[];

  @Expose()
  @IsOptional()
  @ToObject()
  @IsObject()
  data?: any;

  @Expose()
  @IsOptional()
  @Type(() => ExtraAtr)
  @ValidateNested({ each: true })
  extra_attr?: ExtraAtr[];

  @Expose()
  @IsOptional()
  @IsEnum(PriceType)
  price_type?: PriceType;

  @Expose()
  @IsOptional()
  @IsEnum(PublishStatus)
  status?: PublishStatus;

  @Expose()
  @ToMongoID()
  @IsOptional()
  @IsMongoID({ each: true })
  relatedProducts?: Types.ObjectId[];

  @Expose()
  @IsOptional()
  @ToMongoID()
  @IsMongoID({ each: true })
  photos?: Types.ObjectId[];

  @Expose()
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
