import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma, User } from '@prisma/client';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() userLoginInput: { email: string; password: string }) {
    const { email, password } = userLoginInput;
    return this.authService.signIn(email, password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signupUser(
    @Body() userCreateInput: Prisma.UserCreateInput,
  ): Promise<Omit<User, 'password'>> {
    return this.authService.signUp(userCreateInput);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
