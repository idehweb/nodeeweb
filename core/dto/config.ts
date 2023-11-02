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
  IsUrl,
  IsArray,
} from 'class-validator';

class ConfigSupervisor {
  @Expose()
  @IsOptional()
  @IsUrl({
    require_host: true,
    require_protocol: true,
    host_whitelist: [/./],
  })
  url?: string;

  @Expose()
  @IsOptional()
  @IsString()
  token?: string;

  @Expose()
  @IsOptional()
  @IsString({ each: true })
  whitelist?: string[];
}

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
  @IsUrl({
    allow_fragments: false,
    require_protocol: true,
    require_host: true,
    host_whitelist: [/.+/],
  })
  @IsOptional()
  host?: string;

  @Expose()
  @IsOptional()
  @IsString()
  favicon?: string;

  @Expose()
  @Allow()
  auth: { [key: string]: any };

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

  @Expose()
  @Type(() => ConfigSupervisor)
  @IsOptional()
  @ValidateNested()
  supervisor?: ConfigSupervisor;
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
