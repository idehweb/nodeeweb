import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export default class {
  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsString()
  password: string;

  @Expose()
  @IsNumber()
  from: number;
}
