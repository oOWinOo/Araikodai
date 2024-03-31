import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, PrismaService , UploadService],
})
export class RoomsModule {}
