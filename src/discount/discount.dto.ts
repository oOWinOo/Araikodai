import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDiscountDto {
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  value: string;
  remaining?: number;
}

export class UpdateDiscountDto {
  @IsOptional()
  type: string;

  @IsOptional()
  value: string;

  @IsOptional()
  remaining: number;
}

export class ApplyDiscountDto {
  @IsNotEmpty()
  userId: number;
}
