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
  UseGuards,
  Delete,
} from '@nestjs/common';
import { Hotel } from '@prisma/client';
import { HotelsService } from './hotels.service';
import {
  HotelDeleteInput,
  HotelInputCreate,
  HotelInputUpdate,
  PresignedPutDto,
} from './hotels.dto';
import { UploadService } from 'src/upload/upload.service';
import { Roles } from 'src/roles/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller('hotels')
export class HotelsController {
  constructor(
    private hotelsService: HotelsService,
    private uploadService: UploadService,
  ) {}

  @Roles(['admin'])
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('image')
  async uploadHotelImage(@Body() uploadInput: PresignedPutDto) {
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
    const presigned =  this.uploadService.getPreSignedURLToViewObject(key);
    return {
      presignedUrl: presigned,
    };
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllHotels(): Promise<Hotel[]> {
    return await this.hotelsService.getAll();
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('search')
  async getByName(@Query() query: { name: string }): Promise<Hotel[]> {
    const { name } = query;
    return await this.hotelsService.getByName(name);
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createHotel(@Body() data: HotelInputCreate) {
    return await this.hotelsService.create(data);
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async editHotel(
    @Body() data: HotelInputUpdate,
    @Param('id') id: number,
  ): Promise<Hotel> {
    return await this.hotelsService.update(data, id);
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async delete(@Param('id') data: HotelDeleteInput) {
    return await this.hotelsService.delete(data);
  }
}
