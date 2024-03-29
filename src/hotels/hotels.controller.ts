import { Body, Controller, HttpStatus, Post, Res, Get, HttpCode } from '@nestjs/common';
import { Response } from 'express';
import { Hotel, Prisma } from '@prisma/client';
import { HotelsService } from './hotels.service';

@Controller('hotels')
export class HotelsController {
  constructor(private hotelsService: HotelsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createHotel(
    @Body() data: Prisma.HotelCreateInput
  ) { 
    return await this.hotelsService.create(data);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllHotels():Promise<Hotel[]>{
    return await this.hotelsService.getAll();
  }
}
