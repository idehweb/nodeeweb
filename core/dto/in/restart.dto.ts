import { Expose } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { RestartPolicy } from '../../types/restart';

export class RestartBody {
  @Expose()
  @IsEnum(RestartPolicy)
  policy: RestartPolicy;

  @Expose()
  @IsOptional()
  @IsBoolean()
  wait?: boolean;
}
