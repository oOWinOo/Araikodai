import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [UserService, PrismaService],
  imports: [ConfigModule.forRoot()],
  exports: [UserService],
})
export class UserModule {}
