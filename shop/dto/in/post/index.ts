import { Photo } from '@nodeeweb/core';
import { ToAny, ToSlug } from '@nodeeweb/core/utils/transform';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class PostCreateDTO {
  @Expose()
  @ToAny()
  @IsOptional()
  active?: boolean;

  @Expose()
  @ToAny()
  @IsOptional()
  category?: Types.ObjectId[];

  @Expose()
  @ToAny()
  @IsOptional()
  data?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  description?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  excerpt?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  views?: any[];

  @Expose()
  @ToSlug()
  @IsOptional()
  slug?: string;

  @Expose()
  @ToAny()
  @IsOptional()
  title?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  elements?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  kind?: string;

  @Expose()
  @ToAny()
  @IsOptional()
  status?: string;

  @Expose()
  @ToAny()
  @IsOptional()
  photos?: Photo[];

  @Expose()
  @ToAny()
  @IsOptional()
  thumbnail?: string;

  @Expose()
  @ToAny()
  @IsOptional()
  metatitle?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  metadescription?: any;
}

export class PostUpdateDTO {
  @Expose()
  @ToAny()
  @IsOptional()
  active?: boolean;

  @Expose()
  @ToAny()
  @IsOptional()
  category?: Types.ObjectId[];

  @Expose()
  @ToAny()
  @IsOptional()
  data?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  description?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  excerpt?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  views?: any[];

  @Expose()
  @ToSlug()
  @IsOptional()
  slug?: string;

  @Expose()
  @ToAny()
  @IsOptional()
  title?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  elements?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  kind?: string;

  @Expose()
  @ToAny()
  @IsOptional()
  status?: string;

  @Expose()
  @ToAny()
  @IsOptional()
  photos?: Photo[];

  @Expose()
  @ToAny()
  @IsOptional()
  thumbnail?: string;

  @Expose()
  @ToAny()
  @IsOptional()
  metatitle?: any;

  @Expose()
  @ToAny()
  @IsOptional()
  metadescription?: any;
}
