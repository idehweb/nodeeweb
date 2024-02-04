import { Expose, Type } from 'class-transformer';
import { IsIn, IsOptional, ValidateNested } from 'class-validator';
import { ShopPluginType } from '../../../types';
import { CorePluginType } from '@nodeeweb/core/types/plugin';
import { ToObject } from '@nodeeweb/core/utils/transform';

export class GatewayFilter {
  @Expose()
  @IsOptional()
  @IsIn([
    ShopPluginType.BANK_GATEWAY,
    ShopPluginType.POST_GATEWAY,
    CorePluginType.SMS,
  ])
  type?: string;
}

export class GatewayQuery extends GatewayFilter {
  @Expose()
  @ToObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => GatewayFilter)
  filter?: GatewayFilter;
}
