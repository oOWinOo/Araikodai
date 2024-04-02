import { IsNotEmpty, IsOptional } from 'class-validator';

export class RoomCreateType {
  @IsNotEmpty()
  name: string;
  @IsOptional()
  description: string;
  @IsNotEmpty()
  imageURL: string;
  @IsNotEmpty()
  price: number;
  @IsNotEmpty()
  occupancy: number;
  @IsNotEmpty()
  hotelId: number;
}

export class RoomDelete {
  @IsNotEmpty() roomId: number;
}
