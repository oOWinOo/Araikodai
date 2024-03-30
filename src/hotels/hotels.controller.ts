import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { Hotel, Prisma } from '@prisma/client';
import { HotelsService } from './hotels.service';
import { HotelInputCreate, HotelInputUpdate } from './hotels.dto';

@Controller('hotels')
export class HotelsController {
  constructor(private hotelsService: HotelsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createHotel(@Body() data: HotelInputCreate) {
    return await this.hotelsService.create(data);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllHotels(): Promise<Hotel[]> {
    return await this.hotelsService.getAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getByName(@Query() name : string): Promise<Hotel[]> {
    return await this.hotelsService.getByName(name);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async editHotel(
    @Body() data: HotelInputUpdate,
    @Param('id') id: number,
  ): Promise<Hotel> {
    return await this.hotelsService.update(data, id);
  }
}
