import { Expose } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export default class {
  @Expose()
  @IsString()
  redirect: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  lifeTime?: number;
}
