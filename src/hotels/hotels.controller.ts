import { Body, Controller, HttpStatus, Post, Res, Get } from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { HotelsService } from './hotels.service';

@Controller('hotels')
export class HotelsController {
  constructor(private hotelsService: HotelsService) {}
  @Post()
  async createHotel(
    @Body() data: Prisma.HotelCreateInput,
    @Res() res: Response,
  ) {
    const result = await this.hotelsService.create(data);
    res.status(HttpStatus.CREATED).json({
      message: 'Create hotel success',
      hotel: result,
    });
  }

  @Get()
  async getAllHotels(@Res() res: Response) {
    const hotels = await this.hotelsService.getAll();
    res.status(HttpStatus.OK).json({
      hotels: hotels,
    });
  }
}
