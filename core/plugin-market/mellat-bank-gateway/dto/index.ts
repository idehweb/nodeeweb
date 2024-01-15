import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export default class {
  @Expose()
  @IsString()
  terminalId: string;

  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsString()
  password: string;
}
