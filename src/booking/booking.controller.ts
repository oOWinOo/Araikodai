import {
  Controller,
  Post,
  Body,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookingInputCreate, BookingInputUpdate } from './booking.dto';
import { Booking } from '@prisma/client';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createBooking(@Body() data: BookingInputCreate): Promise<Booking> {
    return await this.bookingService.create(data);
  }

  @Patch()
  async editBooking(@Body() data: BookingInputUpdate): Promise<Booking> {
    return await this.bookingService.edit(data);
  }
}
