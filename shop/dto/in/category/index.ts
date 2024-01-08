import { ToAny, ToSlug } from '@nodeeweb/core/utils/transform';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class CategoryCreateDTO {
  @Expose()
  @ToAny()
  @IsOptional()
  name?: any;

  @Expose()
  @ToSlug()
  @IsOptional()
  slug?: string;

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
  data?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  values?: [];

  @Expose()
  @ToAny()
  @IsOptional()
  parent?: any;
}

export class CategoryUpdateDTO {
  @Expose()
  @ToAny()
  @IsOptional()
  name?: any;

  @Expose()
  @ToSlug()
  @IsOptional()
  slug?: string;

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
  data?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  values?: [];

  @Expose()
  @ToAny()
  @IsOptional()
  parent?: any;
}
