import { IsNotEmpty } from 'class-validator';

export class CreateDiscountDto {
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  value: string;
  remaining?: number;
}
