import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsString,
  IsDateString,
  IsPhoneNumber,
  IsNumber,
} from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserCreateInputDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: Date;

  @IsNotEmpty()
  @IsPhoneNumber()
  telephoneNumber: string;

  @IsOptional()
  @IsString()
  profileImage: string;
}

export class ApplyDiscountDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
