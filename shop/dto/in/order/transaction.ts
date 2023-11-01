import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Address } from '../user';

class Post {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsOptional()
  @IsString()
  provider?: string;
}

export class CreateTransactionBody {
  @Expose()
  @IsOptional()
  @IsString()
  discount?: string;

  @Expose()
  @ValidateNested()
  @Type(() => Post)
  post: Post;

  @Expose()
  @ValidateNested()
  @Type(() => Address)
  address: Address;
}
