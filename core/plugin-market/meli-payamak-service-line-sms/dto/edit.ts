import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export default class {
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
  @IsNumber()
  from?: number;
}
