import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private adminService: AdminService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.userService.user({ email });
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.name, role: 'user' };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signInAdmin(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const admin = await this.adminService.admin({ username });
    const isMatch = pass === admin.password;
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { sub: admin.id, username: admin.username, role: 'admin' };
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
