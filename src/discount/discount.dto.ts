import { IsNotEmpty } from 'class-validator';

export class CreateDiscountDto {
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  value: string;
  remaining?: number;
}

export class UpdateDiscountDto {
  type?: string;
  value?: string;
  remaining?: number;
}

export class ApplyDiscountDto {
  @IsNotEmpty()
  userId: number;
}
