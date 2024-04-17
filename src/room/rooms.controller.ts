import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Get,
  HttpCode,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RoomsService } from './rooms.service';
import { RoomCreateType, RoomUpdateType } from './rooms.dto';
import { PresignedPutDto } from 'src/upload/upload.dto';
import { UploadService } from 'src/upload/upload.service';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('rooms')
export class RoomsController {
  constructor(
    private roomsService: RoomsService,
    private uploadService: UploadService,
  ) {}

  @Roles(['admin'])
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() data: RoomCreateType) {
    return await this.roomsService.create(data);
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('image')
  async uploadRoomImage(@Body() uploadInput: PresignedPutDto) {
    const presigned = await this.uploadService.getPreSignedURL(
      uploadInput.key,
      uploadInput.contentType,
    );
    return {
      presignedUrl: presigned,
    };
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('image/:key')
  async getPresignedGet(@Param('key') key: string) {
    const presigned = await this.uploadService.getPreSignedURLToViewObject(key);
    return {
      presignedUrl: presigned,
    };
  }

  @Roles(['admin', 'user'])
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAll() {
    return await this.roomsService.getAll();
  }

  @Roles(['admin', 'user'])
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getAllFromHotel(@Param('id') hotelId: number) {
    return await this.roomsService.getFromHotelId(hotelId);
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id') roomId: number,
    @Body() data: RoomUpdateType,
  ) {
    return await this.roomsService.editRoom(data, roomId);
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  async delete(@Param('id') roomId: number) {
    return await this.roomsService.deleteRoom(roomId);
  }
}
