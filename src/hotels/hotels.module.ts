import { Module } from '@nestjs/common';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';

@Module({
  controllers: [HotelsController],
  providers: [HotelsService, PrismaService, UploadService],
})
export class HotelsModule {}
