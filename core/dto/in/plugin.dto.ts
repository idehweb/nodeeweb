import { Expose, Transform } from 'class-transformer';
import { IsIn, IsObject, IsOptional } from 'class-validator';
import { PluginStatus } from '../../schema/plugin.schema';
import { Types } from 'mongoose';
import { IsMongoID, IsSlug, ToMongoID } from '../../utils/validation';
import { ToSlug } from '../../utils/transform';

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

export class PluginMarketAddBody {
  @Expose()
  @ToMongoID()
  @IsMongoID()
  file: Types.ObjectId;

  // @Expose()
  // @ToSlug()
  // @IsSlug()
  // slug: string;
}
