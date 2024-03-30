import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [UploadService],
  exports: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
