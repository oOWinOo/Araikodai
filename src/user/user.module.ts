import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user.controller';
import { UploadService } from 'src/upload/upload.service';

@Module({
  providers: [UserService, PrismaService, UploadService],
  imports: [ConfigModule.forRoot()],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
