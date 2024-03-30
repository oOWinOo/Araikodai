import { IsNotEmpty, IsEmail } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}

export class UserCreateInputDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  birthDate: string | Date;

  @IsNotEmpty()
  telephoneNumber: string;
}

export class ApplyDiscountDto {
  @IsNotEmpty()
  userId: number;
}
