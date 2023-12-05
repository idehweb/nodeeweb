import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { ActivityStatus } from '../../../schema/activity.schema';
import { IsMongoID, ToMongoID } from '@nodeeweb/core/utils/validation';
import { Types } from 'mongoose';

export class ActivityBody {
  @Expose()
  @IsMongoID()
  @ToMongoID()
  id: Types.ObjectId;

  @Expose()
  @IsEnum(ActivityStatus)
  status: ActivityStatus;
}
