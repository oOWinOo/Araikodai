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
    try {
      const result = this.hotelsService.create(data);
      res.status(HttpStatus.CREATED).json({
        message: 'Create hotel success',
        hotel: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Can not create hotel',
        error: error,
      });
    }
  }

  @Get()
  async getAllHotels(@Res() res: Response) {
    try {
      const hotels = await this.hotelsService.getAll();
      res.status(HttpStatus.OK).json({
        hotels: hotels,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Can not get all hotels',
        error: error,
      });
    }
  }
}
