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
import { PresignedPutDto, RoomCreateType } from './rooms.dto';
import { UploadService } from 'src/upload/upload.service';

@Controller('rooms')
export class RoomsController {
  constructor(
    private roomsService: RoomsService,
    private uploadService: UploadService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() data: RoomCreateType) {
    return await this.roomsService.create(data);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async uploadRoomImage(@Body() uploadInput: PresignedPutDto) {
    const presigned = await this.uploadService.getPreSignedURL(
      uploadInput.key,
      uploadInput.contentType,
    );
    return {
      presignedUrl: presigned,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get(':key')
  async getPresignedGet(@Param('key') key: string) {
    const presigned = await this.uploadService.getPreSignedURLToViewObject(key);
    return {
      presignedUrl: presigned,
    };
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
