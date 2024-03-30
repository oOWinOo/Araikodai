import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { HotelsModule } from './hotels/hotels.module';
import { DiscountModule } from './discount/discount.module';
@Module({
  imports: [
    AuthModule,
    HotelsModule,
    DiscountModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
})
export class AppModule {}
