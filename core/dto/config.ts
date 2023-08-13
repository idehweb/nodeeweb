import { Expose, Type } from 'class-transformer';
import {
  Allow,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
  IsObject,
} from 'class-validator';

export class CoreConfigLimit {
  @Expose()
  @IsNumber()
  @IsPositive()
  @IsInt()
  request_limit: number;

  @Expose()
  @IsNumber()
  @IsPositive()
  request_limit_window_s: number;
}

export class CoreConfigLimitBody extends CoreConfigLimit {
  @IsOptional()
  request_limit: number;

  @IsOptional()
  request_limit_window_s: number;
}

export class CoreConfigSmsOn {
  @Expose()
  @IsString()
  otp: string;

  @Expose()
  @IsOptional()
  @IsString()
  register?: string;
}

export class CoreConfigSmsOnBody extends CoreConfigSmsOn {
  @IsOptional()
  otp: string;
}
export class CoreConfigDto {
  @Expose()
  @IsString()
  app_name: string;

  @Expose()
  @IsOptional()
  @IsString()
  favicon?: string;

  @Expose()
  @Allow()
  auth: { [key: string]: string };

  @Expose()
  @Allow()
  plugin: { [key: string]: object };

  @Expose()
  @Type(() => CoreConfigLimit)
  @IsObject()
  @ValidateNested()
  limit: CoreConfigLimit;

  @Expose()
  @Type(() => CoreConfigSmsOn)
  @IsObject()
  @ValidateNested()
  sms_message_on: CoreConfigSmsOn;
}

class CoreConfConfBody extends CoreConfigDto {
  @IsOptional()
  app_name: string;

  @IsOptional()
  @Type(() => CoreConfigLimitBody)
  limit: CoreConfigLimitBody;

  @IsOptional()
  @Type(() => CoreConfigSmsOnBody)
  sms_message_on: CoreConfigSmsOnBody;
}

export class CoreConfigBody {
  @Expose()
  @Type(() => CoreConfConfBody)
  @IsObject()
  @ValidateNested()
  config: CoreConfConfBody;

  @Expose()
  @IsOptional()
  @IsBoolean()
  restart?: boolean;
}
