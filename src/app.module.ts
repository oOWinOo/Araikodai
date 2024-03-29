import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { HotelsModule } from './hotels/hotels.module';


@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ,
    HotelsModule,
  ],
})
export class AppModule {}
