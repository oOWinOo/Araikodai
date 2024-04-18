import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Body,
  Post,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserEditProfile } from './user.dto';
import { UserService } from './user.service';
import { PresignedPutDto } from 'src/upload/upload.dto';
import { UploadService } from 'src/upload/upload.service';

@Controller('user')
export class UserController {
  constructor(
    private userServices: UserService,
    private uploadService: UploadService,
  ) {}

  @Roles(['user'])
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateProfile(
    @Param('id') userId: number,
    @Body() data: UserEditProfile,
  ) {
    return await this.userServices.updateUser(userId, data);
  }

  @Roles(['user'])
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

  @Roles(['user'])
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('image/:key')
  async getPresignedGet(@Param('key') key: string) {
    const presigned = this.uploadService.getPreSignedURLToViewObject(key);
    return {
      presignedUrl: presigned,
    };
  }
}
