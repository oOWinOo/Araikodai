import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.userService.user({ email });
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(data: Prisma.UserCreateInput): Promise<Omit<User, 'password'>> {
    const salt = await bcrypt.genSalt();
    const { password, ...unChanged } = data;
    const newPassword = password;
    const hashPassword = await bcrypt.hash(newPassword, salt);

    return this.userService.createUser({
      password: hashPassword,
      ...unChanged,
    });
  }
}
