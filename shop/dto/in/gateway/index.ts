import { Expose } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';
import { ShopPluginType } from '../../../types';
import { CorePluginType } from '@nodeeweb/core/types/plugin';

export class GatewayQuery {
  @Expose()
  @IsOptional()
  @IsIn([
    ShopPluginType.BANK_GATEWAY,
    ShopPluginType.POST_GATEWAY,
    CorePluginType.SMS,
  ])
  type?: string;
}
