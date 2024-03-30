import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Get,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createRoom(@Body() data: Prisma.RoomCreateInput) {
    console.log('AAAAAA');
    return await this.roomsService.create(data);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllRooms(@Body() hotelId: number) {
    return await this.roomsService.getAll(hotelId);
  }
}
