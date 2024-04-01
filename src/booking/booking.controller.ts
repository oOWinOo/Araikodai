import {
  Controller,
  Post,
  Body,
  Patch,
  HttpCode,
  HttpStatus,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { BookingInputCreate, BookingInputUpdate } from './booking.dto';
import { Booking } from '@prisma/client';
import { BookingService } from './booking.service';
import { Roles } from 'src/roles/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createBooking(@Body() data: BookingInputCreate): Promise<Booking> {
    return await this.bookingService.create(data);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async editBooking(
    @Param() bookingId: number,
    @Body() data: BookingInputUpdate,
  ): Promise<Booking> {
    return await this.bookingService.edit(bookingId, data);
  }

  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  async deleteBooking(@Param() bookingId: number) {
    return await this.bookingService.delete(bookingId);
  }
}
