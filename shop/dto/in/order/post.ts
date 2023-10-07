import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class PostOptionQuery {
  @Expose()
  @IsOptional()
  @IsString()
  street?: string;

  @Expose()
  @IsOptional()
  @IsString()
  city?: string;

  @Expose()
  @IsOptional()
  @IsString()
  state?: string;
}
