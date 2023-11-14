import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { ActivityStatus } from '../../../schema/activity.schema';

export class ActivityUpdateBody {
  @Expose()
  @IsEnum(ActivityStatus)
  status: ActivityStatus;
}
