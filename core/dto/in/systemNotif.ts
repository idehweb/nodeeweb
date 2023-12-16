import { Expose } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional } from 'class-validator';

export class SystemNotifUpdateBody {
  @Expose()
  @IsOptional()
  @IsIn([true])
  @IsBoolean()
  view?: boolean;
}
