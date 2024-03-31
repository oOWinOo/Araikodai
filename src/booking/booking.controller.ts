import { Controller, Post, Body } from '@nestjs/common';
import { BookingInputCreate } from './booking.dto';
import { Booking } from '@prisma/client';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}
  
  @Post()
  async createBooking(@Body() data: BookingInputCreate): Promise<Booking> {
    await this.bookingService.create(data);
    return;
  }
}
