import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDiscountDto {
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  value: number;
  remaining?: number;
}

export class UpdateDiscountDto {
  @IsOptional()
  type: string;

  @IsOptional()
  value: number;

  @IsOptional()
  remaining: number;
}

export class ApplyDiscountDto {
  @IsNotEmpty()
  userId: number;
}

export class DiscountReturn {
  error: string;
  value: number;

  constructor() {
    this.error = '';
    this.value = 0;
  }
}
