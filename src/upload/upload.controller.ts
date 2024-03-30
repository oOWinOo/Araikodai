import { Controller } from '@nestjs/common';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @HttpCode(HttpStatus.OK)
  @Post('s3')
  async uploadFile(@UploadedFile() file) {}
}
