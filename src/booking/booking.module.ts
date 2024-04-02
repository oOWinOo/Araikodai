import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiscountService } from 'src/discount/discount.service';

@Module({
  controllers: [BookingController],
  providers: [BookingService, PrismaService, DiscountService],
})
export class BookingModule {}
