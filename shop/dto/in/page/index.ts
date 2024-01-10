import { Custom, IsSlug } from '@nodeeweb/core/utils/validation';
import { Expose, Transform } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { PublishStatus, MultiLang } from '../../../schema/_base.schema';
import { ToArray, ToObject, ToSlug } from '@nodeeweb/core/utils/transform';
export class PageBody {
  @Expose()
  @IsOptional()
  @IsObject()
  @ToObject()
  data?: any;

  @Expose()
  @Allow()
  @ToArray()
  elements?: any;

  @Expose()
  @Allow()
  @ToArray()
  mobileElements?: any;

  @Expose()
  @ToArray()
  @Allow()
  desktopElements?: any;

  @Expose()
  @IsOptional()
  @IsObject()
  @ToObject()
  description?: any;

  @Expose()
  @IsOptional()
  @IsObject()
  @ToObject()
  excerpt?: any;

  @Expose()
  @IsString()
  @ToSlug()
  @IsSlug()
  @Custom((value) => !String(value).startsWith('/'), {
    name: 'StartWith',
    message: 'slug can not start with /',
  })
  slug: string;

  @Expose()
  @IsObject()
  @ToObject()
  title: any;

  @Expose()
  @Allow()
  access?: string;

  @Expose()
  @Allow()
  kind?: string;

  @Expose()
  @Allow()
  classes?: string;

  @Expose()
  @Allow()
  backgroundColor?: string;

  @Expose()
  @Allow()
  padding?: string;

  @Expose()
  @Allow()
  margin?: string;

  @Expose()
  @IsOptional()
  @IsString()
  path?: string;

  @Expose()
  @Allow()
  maxWidth?: string;

  @Expose()
  @IsOptional()
  @IsEnum(PublishStatus)
  status: PublishStatus;

  @Expose()
  @Allow()
  photos?: any;

  @Expose()
  @Allow()
  thumbnail?: string;

  @Expose()
  @IsOptional()
  @IsObject()
  @ToObject()
  metatitle: any;

  @Expose()
  @IsOptional()
  @IsObject()
  @ToObject()
  metadescription: any;

  @Expose()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];
}

export class PageUpdate {
  @Expose()
  @IsOptional()
  @IsObject()
  @ToObject()
  data?: any;

  @Expose()
  @IsOptional()
  @IsObject()
  @ToObject()
  description?: any;

  @Expose()
  @IsOptional()
  @IsObject()
  @ToObject()
  excerpt?: any;

  @Expose()
  @IsOptional()
  @IsString()
  @ToSlug()
  @IsSlug()
  @Custom((value) => !String(value).startsWith('/'), {
    name: 'StartWith',
    message: 'slug can not start with /',
  })
  slug: string;

  @Expose()
  @IsOptional()
  @IsObject()
  @ToObject()
  title?: any;

  @Expose()
  @Allow()
  access?: string;

  @Expose()
  @Allow()
  kind?: string;

  @Expose()
  @Allow()
  classes?: string;

  @Expose()
  @Allow()
  backgroundColor?: string;

  @Expose()
  @Allow()
  @Transform(({ obj, key }) => obj[key])
  elements?: any;

  @Expose()
  @Allow()
  @Transform(({ obj, key }) => obj[key])
  mobileElements?: any;

  @Expose()
  @Transform(({ obj, key }) => obj[key])
  @Allow()
  desktopElements?: any;

  @Expose()
  @Allow()
  padding?: string;

  @Expose()
  @Allow()
  margin?: string;

  @Expose()
  @IsOptional()
  @IsString()
  path?: string;

  @Expose()
  @Allow()
  maxWidth?: string;

  @Expose()
  @IsOptional()
  @IsEnum(PublishStatus)
  status: PublishStatus;

  @Expose()
  @Allow()
  photos?: any;

  @Expose()
  @Allow()
  thumbnail?: string;

  @Expose()
  @IsOptional()
  @IsObject()
  @ToObject()
  metatitle: any;

  @Expose()
  @IsOptional()
  @IsObject()
  @ToObject()
  metadescription: any;

  @Expose()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];
}
