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
  async createRoom(@Body() data: Prisma.RoomCreateInput, @Res() res: Response) {
    const result = await this.roomsService.create(data);
    res.status(HttpStatus.CREATED).json({
      message: 'Create room success',
      room: result,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllRooms(@Res() res: Response, @Body() hotelId: number) {
    return await this.roomsService.getAll(hotelId);
  }
}
