import {
  CoreConfigBody,
  CoreConfigColor,
  CoreConfigColorBody,
  CoreConfigDto,
  CoreConfigLimit,
  CoreConfigLimitBody,
  CoreConfigSmsOn,
  Favicon,
} from '@nodeeweb/core';
import { ToAny, ToArray } from '@nodeeweb/core/utils/transform';
import { IsMongoID, ToMongoID } from '@nodeeweb/core/utils/validation';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsPostalCode,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

export enum Currency {
  Toman = 'Toman',
  Rial = 'Rial',
}
class Consumer {
  @Expose()
  @IsString()
  key: string;

  @Expose()
  @IsString()
  value: string;
}
class Factor {
  @Expose()
  @IsOptional()
  @IsString()
  name: string;

  @Expose()
  @IsOptional()
  @IsString()
  url: string;

  @Expose()
  @IsOptional()
  @IsString()
  address?: string;

  @Expose()
  @IsOptional()
  @IsString()
  tel?: string;

  @Expose()
  @IsOptional()
  @IsString()
  fax?: string;

  @Expose()
  @IsOptional()
  @IsPostalCode('IR')
  postalCode?: string;

  @Expose()
  @IsOptional()
  @IsString()
  registrationCode?: string;

  @Expose()
  @IsOptional()
  @IsString()
  economicCode?: string;
}
class FactorBody extends Factor {}
class ShopConfigSmsOn extends CoreConfigSmsOn {
  @Expose()
  @IsOptional()
  @IsString()
  approach_transaction_expiration: string;

  @Expose()
  @IsOptional()
  @IsString()
  paid_order: string;

  @Expose()
  @IsOptional()
  @IsString()
  cancel_order: string;

  @Expose()
  @IsOptional()
  @IsString()
  post_order: string;

  @Expose()
  @IsOptional()
  @IsString()
  complete_order: string;
}

class ShopConfigSmsOnBody extends ShopConfigSmsOn {
  @IsOptional()
  otp: string;
}

export class ShopConfigLimit extends CoreConfigLimit {
  @Expose()
  @IsOptional()
  @IsNumber()
  transaction_expiration_s: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  approach_transaction_expiration: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @IsInt()
  max_products_in_cart: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @IsInt()
  max_product_combination_quantity_in_cart: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @IsInt()
  max_need_to_pay_transaction: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @IsInt()
  max_need_to_pay_order: number;
}

class ShopConfigLimitBody extends ShopConfigLimit {
  @IsOptional()
  request_limit: number;

  @IsOptional()
  request_limit_window_s: number;
}

export class ShopPost {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  provider: string;

  @Expose()
  @IsString()
  title: string;

  @Expose()
  @IsString()
  description: string;

  @Expose()
  @IsBoolean()
  active: boolean;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @Expose()
  @IsOptional()
  @IsString()
  priceFormula?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  base_price?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  min_price?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  max_price?: number;

  @Expose()
  @IsOptional()
  @IsString({ each: true })
  cities?: string[];

  @Expose()
  @IsOptional()
  @IsString({ each: true })
  states?: string[];

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  products_min_price: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  products_max_price: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  products_min_weight: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  products_max_weight: number;
}

export class ShopConfigDto extends CoreConfigDto {
  @Expose()
  @IsOptional()
  @IsBoolean()
  shop_active: boolean;

  @Expose()
  @IsOptional()
  @IsString()
  shop_inactive_message: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  tax: number;

  @Expose()
  @IsOptional()
  @IsEnum(Currency)
  currency: Currency;

  @Expose()
  @IsOptional()
  @IsString()
  entry_submit_message: string;

  @Expose()
  @Type(() => Factor)
  @ValidateNested()
  factor: Factor;

  @Type(() => ShopConfigLimit)
  limit: ShopConfigLimit;

  @Expose()
  @IsOptional()
  @Type(() => ShopPost)
  @ValidateNested({ each: true })
  manual_post: ShopPost[];

  @Type(() => ShopConfigSmsOn)
  sms_message_on: ShopConfigSmsOn;

  @Expose()
  @IsOptional()
  @IsString()
  payment_redirect: string;

  @Expose()
  @IsOptional()
  @IsArray()
  @Type(() => Consumer)
  @ValidateNested({ each: true })
  consumer_status: Consumer[];
}

export class ShopConfConfBody extends ShopConfigDto {
  @IsOptional()
  app_name: string;

  @IsOptional()
  @Type(() => FactorBody)
  factor: Factor;

  @IsOptional()
  @Type(() => ShopConfigLimitBody)
  limit: ShopConfigLimitBody;

  @IsOptional()
  @Type(() => ShopConfigSmsOnBody)
  sms_message_on: ShopConfigSmsOnBody;

  @Exclude()
  favicon?: string;

  @Exclude()
  favicons?: Favicon[];

  @Expose()
  @IsOptional()
  @IsMongoID()
  @ToMongoID()
  favicon_id?: Types.ObjectId;

  @IsOptional()
  @Type(() => CoreConfigColorBody)
  color: CoreConfigColor;
}

export class ShopConfigBody extends CoreConfigBody {
  @Type(() => ShopConfConfBody)
  config: Partial<ShopConfConfBody>;
}
