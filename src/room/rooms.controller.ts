import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Get,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RoomsService } from './rooms.service';
import { RoomCreateType } from './type';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() data: RoomCreateType) {
    return await this.roomsService.create(data);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAll() {
    return await this.roomsService.getAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getAllFromHotel(@Param('id') hotelId: number) {
    return await this.roomsService.getFromHotelId(hotelId);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id') roomId: number,
    @Body() data: Prisma.RoomUpdateInput,
  ) {
    return await this.roomsService.editRoom(data, roomId);
  }
}
