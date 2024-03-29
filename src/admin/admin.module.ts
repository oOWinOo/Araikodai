import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [AdminService, PrismaService],
  imports: [ConfigModule.forRoot()],
  exports: [AdminService],
})
export class AdminModule {}
