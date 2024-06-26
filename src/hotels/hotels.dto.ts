import { IsNotEmpty, IsOptional } from 'class-validator';

export class HotelInputCreate {
  @IsNotEmpty() name: string;
  @IsNotEmpty() address: string;
  @IsNotEmpty() imageURL: string;
  @IsNotEmpty() telephone: string;
  @IsOptional() detail: string;
}

export class HotelInputUpdate {
  @IsOptional() name: string;
  @IsOptional() address: string;
  @IsOptional() imageURL: string;
  @IsOptional() telephone: string;
  @IsOptional() detail: string;
}

export class HotelDeleteInput {
  @IsNotEmpty() hotelId: number;
}
