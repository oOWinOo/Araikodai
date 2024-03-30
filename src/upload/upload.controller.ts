import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { PresignedPutDto } from './upload.dto';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async getPresignedPut(@Body() uploadInput: PresignedPutDto) {
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
}
