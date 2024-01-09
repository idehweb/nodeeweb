import { Expose, Exclude, Type } from 'class-transformer';
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
  IsHexColor,
} from 'class-validator';
import { IsHTMLString, IsMongoID, ToMongoID } from '../utils/validation';
import { Types } from 'mongoose';

export class Favicon {
  @Expose()
  @IsString()
  source: string;

  @Expose()
  @IsMongoID()
  id: string;

  @Expose()
  @IsString()
  dist: string;
}

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

export class CoreConfigColor {
  @Expose()
  @IsOptional()
  @IsHexColor()
  primary: string;

  @Expose()
  @IsOptional()
  @IsHexColor()
  secondary: string;

  @Expose()
  @IsOptional()
  @IsHexColor()
  text: string;

  @Expose()
  @IsOptional()
  @IsHexColor()
  background: string;

  @Expose()
  @IsOptional()
  @IsHexColor()
  footerBackground: string;
}

export class CoreConfigColorBody extends CoreConfigColor {
  @IsOptional()
  primary: string;

  @IsOptional()
  secondary: string;

  @IsOptional()
  text: string;

  @IsOptional()
  background: string;

  @IsOptional()
  footerBackground: string;
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
  @IsOptional()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => Favicon)
  favicons?: Favicon[];

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

  @Expose()
  @IsOptional()
  @IsString()
  @IsHTMLString()
  head_first?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsHTMLString()
  head_last?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsHTMLString()
  body_first?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsHTMLString()
  body_last?: string;

  @Expose()
  @Type(() => CoreConfigColor)
  @IsObject()
  @ValidateNested()
  color: CoreConfigColor;
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

  @Exclude()
  favicon?: string;

  @Exclude()
  favicons?: Favicon[];

  @Expose()
  @IsOptional()
  @IsMongoID()
  @ToMongoID()
  favicon_id?: Types.ObjectId;

  @IsOptional()
  @Type(() => CoreConfigColorBody)
  color: CoreConfigColorBody;
}

export class CoreConfigBody {
  @Expose()
  @Type(() => CoreConfConfBody)
  @IsObject()
  @ValidateNested()
  config: Partial<CoreConfConfBody>;

  @Expose()
  @IsOptional()
  @IsBoolean()
  restart?: boolean;
}
