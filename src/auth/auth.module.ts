import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from 'src/admin/admin.module';
// import { APP_GUARD } from '@nestjs/core';
// import { AuthGuard } from './auth.guard';
import { BookingController } from 'src/booking/booking.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES },
    }),
    UserModule,
    ConfigModule,
    AdminModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
  exports: [AuthService],
})
export class AuthModule {}
