import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { HotelsModule } from './hotels/hotels.module';
import { DiscountModule } from './discount/discount.module';
@Module({
  imports: [
    AuthModule,
    HotelsModule,
    DiscountModule,
    ConfigModule.forRoot(
    ),
  ],
})
export class AppModule {}
