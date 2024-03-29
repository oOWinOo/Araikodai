import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { HotelsModule } from './hotels/hotels.module';
import { HotelsService } from './hotels/hotels.service';
import { HotelsController } from './hotels/hotels.controller';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
  , HotelsModule],
})
export class AppModule {}
