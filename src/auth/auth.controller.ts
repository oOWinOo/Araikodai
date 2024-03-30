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
import { User } from '@prisma/client';
import { AuthGuard } from './auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { SignInDto, UserCreateInputDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() userLoginInput: SignInDto) {
    const { email, password } = userLoginInput;
    return this.authService.signIn(email, password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signupUser(
    @Body() userCreateInput: UserCreateInputDto,
  ): Promise<Omit<User, 'password'>> {
    return this.authService.signUp(userCreateInput);
  }

  @Roles(['user'])
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('login-admin')
  async signInAdmin(
    @Body() adminLoginInput: { username: string; password: string },
  ) {
    const { username, password } = adminLoginInput;
    return this.authService.signInAdmin(username, password);
  }
}
