import {
  CoreConfigDto,
  CoreConfigLimit,
  CoreConfigSmsOn,
} from '@nodeeweb/core';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum Currency {
  Toman = 'Toman',
  Rial = 'Rial',
}
class Factor {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  tel?: string;

  @IsOptional()
  @IsString()
  fax?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  registrationCode?: string;

  @IsOptional()
  @IsString()
  economicCode?: string;
}
class ShopConfigSmsOn extends CoreConfigSmsOn {
  @IsOptional()
  @IsString()
  approach_transaction_expiration?: string;

  @IsOptional()
  @IsString()
  success_transaction?: string;

  @IsOptional()
  @IsString()
  fail_transaction?: string;

  @IsOptional()
  @IsString()
  cancel_order?: string;

  @IsOptional()
  @IsString()
  post_order?: string;

  @IsOptional()
  @IsString()
  complete_order?: string;
}

export class ShopConfigLimit extends CoreConfigLimit {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  transaction_expiration_s: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  approach_transaction_expiration: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsInt()
  max_products_in_cart: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsInt()
  max_product_quantities_in_cart: number;
}

class ShopManualPost {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsBoolean()
  active: boolean;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsString({ each: true })
  cities?: string[];

  @IsOptional()
  @IsNumber()
  @IsPositive()
  products_min_price: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  products_max_price: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  products_min_weight: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  products_max_weight: number;
}

export class ShopConfigDto extends CoreConfigDto {
  @IsOptional()
  @IsBoolean()
  shop_active?: boolean;

  @IsOptional()
  @IsString()
  shop_inactive_message?: string;

  @IsOptional()
  @IsPositive()
  tax?: number;

  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @IsOptional()
  @IsString()
  entry_submit_message?: string;

  @Type(() => Factor)
  @ValidateNested()
  factor: Factor;

  @Type(() => ShopConfigLimit)
  limit: ShopConfigLimit;

  @IsOptional()
  @Type(() => ShopManualPost)
  @ValidateNested({ each: true })
  manual_post: ShopManualPost[];

  @Type(() => ShopConfigSmsOn)
  sms_message_on: ShopConfigSmsOn;

  consumer_status: { key: string; value: string }[];
}
