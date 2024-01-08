import { ToAny, ToSlug } from '@nodeeweb/core/utils/transform';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class AttributeCreateDTO {
  @Expose()
  @ToAny()
  @IsOptional()
  name?: any;

  @Expose()
  @ToSlug()
  @IsOptional()
  slug: string;

  @Expose()
  @ToAny()
  @IsOptional()
  type?: string;

  @Expose()
  @ToAny()
  @IsOptional()
  image?: string;

  @Expose()
  @ToAny()
  @IsOptional()
  useInFilter?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  data?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  metatitle?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  metadescription?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  description?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  values?: any;
}

export class AttributeUpdateDTO {
  @Expose()
  @ToAny()
  @IsOptional()
  name?: any;

  @Expose()
  @ToSlug()
  @IsOptional()
  slug: string;

  @Expose()
  @ToAny()
  @IsOptional()
  type?: string;

  @Expose()
  @ToAny()
  @IsOptional()
  image?: string;

  @Expose()
  @ToAny()
  @IsOptional()
  useInFilter?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  data?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  metatitle?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  metadescription?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  description?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  values?: any;
}
