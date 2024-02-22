import { Expose, Transform } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export default class {
  @Expose()
  @IsString()
  botToken: string;

  @Expose()
  @IsNumber()
  channelId: number;

  @Expose()
  @Transform(({ value }) => (value ? value : 'local'))
  @IsOptional()
  @IsString()
  @IsIn(['local', 'nodeeweb.com', 'nodeeweb.ir'])
  providerType: 'local' | 'nodeeweb.com' | 'nodeeweb.ir';

  @Expose()
  @IsOptional()
  @IsString()
  apiKey?: string;
}
