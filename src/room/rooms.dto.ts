import { IsNotEmpty } from 'class-validator';

export class RoomCreateType {
  @IsNotEmpty()
  name: string;
  description?: string;
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

export class PresignedPutDto {
  @IsNotEmpty()
  key: string;
  @IsNotEmpty()
  contentType: 'image/jpeg' | 'image/png' | 'image/svg';
}
