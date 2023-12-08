import { Custom, IsSlug } from '@nodeeweb/core/utils/validation';
import { Expose } from 'class-transformer';
import { Allow, IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { PublishStatus, MultiLang } from '../../../schema/_base.schema';

export class PageBody {
  @Expose()
  @IsOptional()
  @IsObject()
  data?: any;

  @Expose()
  @IsOptional()
  @IsObject()
  description?: any;

  @Expose()
  @IsOptional()
  @IsObject()
  excerpt?: any;

  @Expose()
  @IsString()
  @IsSlug()
  @Custom((value) => !String(value).startsWith('/'), {
    name: 'StartWith',
    message: 'slug can not start with /',
  })
  slug: string;

  @Expose()
  @IsObject()
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
  metatitle: any;

  @Expose()
  @IsOptional()
  @IsObject()
  metadescription: any;
}

export class PageUpdate {
  @Expose()
  @IsOptional()
  @IsObject()
  data?: any;

  @Expose()
  @IsOptional()
  @IsObject()
  description?: any;

  @Expose()
  @IsOptional()
  @IsObject()
  excerpt?: any;

  @Expose()
  @IsOptional()
  @IsString()
  @IsSlug()
  @Custom((value) => !String(value).startsWith('/'), {
    name: 'StartWith',
    message: 'slug can not start with /',
  })
  slug: string;

  @Expose()
  @IsOptional()
  @IsObject()
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
  elements?: any;

  @Expose()
  @Allow()
  mobileElements?: any;

  @Expose()
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
  metatitle: any;

  @Expose()
  @IsOptional()
  @IsObject()
  metadescription: any;
}
