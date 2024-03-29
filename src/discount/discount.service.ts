import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DiscountService {
  constructor(private prisma: PrismaService) {}

  async create(createInput: Prisma.DiscountCreateInput) {
    try {
      const newDiscount = await this.prisma.discount.create({
        data: createInput,
      });
      return newDiscount;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // async admin(
  //   adminWhereUniqueInput: Prisma.AdminWhereUniqueInput,
  // ): Promise<Admin | null> {
  //   return this.prisma.admin.findUnique({
  //     where: adminWhereUniqueInput,
  //   });
  // }
}
