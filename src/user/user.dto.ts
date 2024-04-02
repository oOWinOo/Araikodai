import { IsOptional } from 'class-validator';

export class UserEditProfile {
  @IsOptional() name: string;
  @IsOptional() birthDate: Date;
  @IsOptional() telephoneNumber: string;
  @IsOptional() profileImage: string;
}
