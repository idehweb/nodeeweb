import { ToAny, ToSlug } from '@nodeeweb/core/utils/transform';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FormCreateDTO {
  @Expose()
  @IsOptional()
  @ToAny()
  description?: any;

  @Expose()
  @IsOptional()
  @ToAny()
  title?: any;

  @Expose()
  @ToSlug()
  @IsOptional()
  slug?: string;

  @Expose()
  @ToAny()
  @IsOptional()
  button: string;

  @Expose()
  @ToAny()
  @IsOptional()
  active?: boolean;

  @Expose()
  @ToAny()
  @IsOptional()
  elements?: [];

  @Expose()
  @ToAny()
  @IsOptional()
  responses?: [];

  @Expose()
  @ToAny()
  @IsOptional()
  status?: String;

  @Expose()
  @ToAny()
  @IsOptional()
  view?: number;

  @Expose()
  @ToAny()
  @IsOptional()
  metatitle?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  metadescription?: any;
}

export class FormUpdateDTO {
  @Expose()
  @IsOptional()
  @ToAny()
  description?: any;

  @Expose()
  @IsOptional()
  @ToAny()
  title?: any;

  @Expose()
  @ToSlug()
  @IsOptional()
  slug?: string;

  @Expose()
  @ToAny()
  @IsOptional()
  button: string;

  @Expose()
  @ToAny()
  @IsOptional()
  active?: boolean;

  @Expose()
  @ToAny()
  @IsOptional()
  elements?: [];

  @Expose()
  @ToAny()
  @IsOptional()
  responses?: [];

  @Expose()
  @ToAny()
  @IsOptional()
  status?: String;

  @Expose()
  @ToAny()
  @IsOptional()
  view?: number;

  @Expose()
  @ToAny()
  @IsOptional()
  metatitle?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  metadescription?: any;
}
