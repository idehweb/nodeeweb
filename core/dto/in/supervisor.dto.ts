import { Expose, Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class SupervisorEvent {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  func: string;

  @Expose()
  @IsOptional()
  @IsArray()
  @Transform(({ obj, key }) => obj[key])
  args?: any[];
}
