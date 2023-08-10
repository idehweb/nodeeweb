import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CoreConfigLimit {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsInt()
  request_limit: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  request_limit_window_s: number;
}
export class CoreConfigSmsOn {
  @IsOptional()
  @IsString()
  otp: string;

  @IsOptional()
  @IsString()
  register?: string;
}
export class CoreConfigDto {
  @IsString()
  app_name: string;

  @IsOptional()
  @IsString()
  favicon?: string;

  auth: { [key: string]: string };
  plugin: { [key: string]: object };

  @IsOptional()
  @Type(() => CoreConfigLimit)
  @ValidateNested()
  limit: CoreConfigLimit;

  @IsOptional()
  @Type(() => CoreConfigSmsOn)
  @ValidateNested()
  sms_message_on: CoreConfigSmsOn;
}
