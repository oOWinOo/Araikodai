import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { AuthGuard } from './auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { SignInDto, UserCreateInputDto } from './auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() userLoginInput: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password } = userLoginInput;
    const jwt = await this.authService.signIn(email, password);
    res.cookie('TOKEN', jwt.access_token, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
    });
    res.send({
      status: HttpStatus.OK,
      token: jwt.access_token,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async signOut(@Res({ passthrough: true }) res: Response) {
    res.cookie('TOKEN', 'none', {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
    });
    res.send({
      status: HttpStatus.OK,
      message: 'logout success',
    });
  }
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signupUser(
    @Body() userCreateInput: UserCreateInputDto,
  ): Promise<Omit<User, 'password'>> {
    return this.authService.signUp(userCreateInput);
  }

  @Roles(['user', 'admin'])
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
