// @ts-nocheck
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Provider } from '../type';

export default class {
  @Expose()
  @IsString()
  @IsEnum(Provider)
  provider: string;

  @Expose()
  @IsString()
  apiKey: string;

  @Expose()
  @IsOptional()
  @IsString()
  model: string;
}
