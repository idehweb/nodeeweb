import { Expose, Transform } from 'class-transformer';
import { IsIn, IsObject, IsOptional } from 'class-validator';
import { PluginStatus } from '../../schema/plugin.schema';

export class PluginBodyAdd {}

export class PluginBodyUpdate {
  @Expose()
  @IsOptional()
  @IsIn([PluginStatus.Active, PluginStatus.Inactive])
  status?: PluginStatus;

  @Expose()
  @IsOptional()
  @IsObject()
  @Transform(({ obj, key }) => obj[key])
  config?: any;
}
