import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class AdminUpdateBody {
  @Expose()
  @IsOptional()
  @IsString()
  username?: string;

  @Expose()
  @IsOptional()
  @IsString()
  password?: string;

  @Expose()
  @IsOptional()
  @IsString()
  firstName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  lastName?: string;
}
