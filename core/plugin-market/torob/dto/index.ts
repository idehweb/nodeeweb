import { Expose } from 'class-transformer';
import { Allow } from 'class-validator';

export default class {
  @Expose()
  @Allow()
  any: any;
}
