import { Expose, Transform, Type } from 'class-transformer';
import {
  IsString,
  Length,
  IsEmail,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Address } from '.';

export class CreateAdminBody {
  @Expose()
  @IsString()
  firstName: string;

  @Expose()
  @IsString()
  lastName: string;

  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsString()
  @Length(8, 20)
  password: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  email?: string;

  @Expose()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Address)
  address?: Address[];
}

export class UpdateAdminBody {
  @Expose()
  @IsOptional()
  @IsString()
  firstName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  lastName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  username?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(8, 20)
  password?: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  email?: string;

  @Expose()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Address)
  address?: Address[];
}
