import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Admin } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async admin(
    adminWhereUniqueInput: Prisma.AdminWhereUniqueInput,
  ): Promise<Admin | null> {
    return this.prisma.admin.findUnique({
      where: adminWhereUniqueInput,
    });
  }
}
