import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User as UserModel } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() userLoginInput: { email: string; password: string }) {
    const { email, password } = userLoginInput;
    return this.authService.signIn(email, password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signupUser(
    @Body() userCreateInput: Prisma.UserCreateInput,
  ): Promise<UserModel> {
    return this.authService.signUp(userCreateInput);
  }
}
