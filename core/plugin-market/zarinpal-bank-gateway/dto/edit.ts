import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export default class {
  @Expose()
  @IsString()
  merchant: string;
}
