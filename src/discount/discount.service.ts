import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DiscountService {
  constructor(private prisma: PrismaService) {}

  async create(createInput: Prisma.DiscountCreateInput) {
    const newDiscount = await this.prisma.discount.create({
      data: createInput,
    });
    return newDiscount;
  }

  async getAll() {
    const allDiscount = await this.prisma.discount.findMany();
    return allDiscount;
  }

  async get(id: number) {
    const discount = await this.prisma.discount.findUnique({
      where: {
        id,
      },
    });
    if (!discount) {
      throw new NotFoundException(`discount id ${id} is not found`);
    }

    return discount;
  }

  async update(id: number, data: Prisma.DiscountUpdateInput) {
    const updatedDiscount = await this.prisma.discount.update({
      where: {
        id,
      },
      data,
    });
    return updatedDiscount;
  }

  async delete(id: number) {
    const deletedDiscount = await this.prisma.discount.delete({
      where: {
        id,
      },
    });
    return deletedDiscount;
  }
  async applyDiscount(id: number, userId: number) {
    const remainingDiscount = await this.prisma.discount.findUnique({
      where: {
        id,
      },
    });
    if (remainingDiscount.remaining <= 0) {
      throw new BadRequestException('this promotion is run out');
    }
    if (remainingDiscount.type.toLowerCase().includes('birthday')) {
      const user = await this.prisma.user.findFirst({
        where: { id: userId },
      });
      if (!user) {
        throw new BadRequestException(`user with ID ${userId} is invalid`);
      }
      const thisMonth = new Date().getMonth();
      if (user.birthDate.getMonth() != thisMonth) {
        throw new BadRequestException(
          `Can not use this discount : Your birth month is not this month.`,
        );
      }
    }
    await this.prisma.$transaction([
      this.prisma.userOnDiscount.create({
        data: {
          userId,
          discountId: id,
        },
      }),
      this.prisma.discount.update({
        data: {
          remaining: remainingDiscount.remaining - 1,
        },
        where: {
          id,
        },
      }),
    ]);
  }
  async userDiscountQuota(id: number, userId: number) {
    const remainingDiscountOfUser = await this.prisma.userOnDiscount.count({
      where: {
        discountId: id,
        userId,
      },
    });
    if (remainingDiscountOfUser > 3) {
      throw new InternalServerErrorException(
        `user break using limit by using ${remainingDiscountOfUser}`,
      );
    }
    return 3 - remainingDiscountOfUser;
  }
}
