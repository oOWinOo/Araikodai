import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { HotelsModule } from './hotels/hotels.module';
import { DiscountModule } from './discount/discount.module';
import { UploadModule } from './upload/upload.module';
import { RoomsModule } from './room/rooms.module';
import { BookingModule } from './booking/booking.module';
@Module({
  imports: [
    AuthModule,
    HotelsModule,
    DiscountModule,
    UploadModule,
    RoomsModule,
    BookingModule,
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
