import { Expose, Transform } from 'class-transformer';
import { IsString, Length, IsEmail, IsOptional } from 'class-validator';

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
}
