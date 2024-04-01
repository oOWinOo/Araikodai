import { IsNotEmpty, IsOptional } from 'class-validator';

export class BookingInputCreate {
  @IsNotEmpty() roomId: number;
  @IsNotEmpty() userId: number;
  @IsNotEmpty() dayNum: number;
  @IsNotEmpty() entryDate: Date;
  @IsOptional() person: number;
}

export class BookingInputDelete {
  @IsNotEmpty() bookingId: number;
}
export class BookingInputUpdate {
  @IsOptional() roomId: number;
  @IsOptional() dayNum: number;
  @IsOptional() entryDate: Date;
  @IsOptional() person: number;
}
