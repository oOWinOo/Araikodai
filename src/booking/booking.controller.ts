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
  Get,
  Req,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { BookingInputCreate, BookingInputUpdate } from './booking.dto';
import { Booking } from '@prisma/client';
import { BookingService } from './booking.service';
import { Roles } from 'src/roles/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Request } from 'express';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllBooking(@Req() req) {
    if (req.user.roles === 'admin') {
      return await this.bookingService.getAllAdmin();
    }
    return await this.bookingService.getAllByUser(req.user.sub);
  }

  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createBooking(
    @Body() data: BookingInputCreate,
    @Req() req,
  ): Promise<Booking> {
    const { sub } = req.user;
    return await this.bookingService.create(data, sub);
  }

  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async editBooking(
    @Req() req,
    @Param('id') bookingId: number,
    @Body() data: BookingInputUpdate,
  ): Promise<Booking> {
    if (req.user.roles === 'admin') {
      return await this.bookingService.edit(bookingId, data);
    }
    const booking = await this.bookingService.getById(bookingId);
    if (booking.userId != req.user.sub) {
      console.log(booking.userId, req.user.sub);
      throw new UnauthorizedException();
    }
    return await this.bookingService.edit(bookingId, data);
  }

  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  async deleteBooking(@Req() req, @Param('id') bookingId: number) {
    if (req.user.roles === 'admin') {
      return await this.bookingService.delete(bookingId);
    }
    const booking = await this.bookingService.getById(bookingId);
    if (booking.userId != req.user.sub) {
      console.log(booking.userId, req.user.sub);
      throw new UnauthorizedException();
    }
    return await this.bookingService.delete(bookingId);
  }
}
