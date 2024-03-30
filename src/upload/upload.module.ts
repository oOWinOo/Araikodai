import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [UploadService, PrismaService],
  exports: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
