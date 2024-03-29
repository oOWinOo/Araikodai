import { Injectable, BadRequestException } from '@nestjs/common';
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
    return discount;
  }

  async update(data: Prisma.DiscountUpdateInput, id: number) {
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
    if (remainingDiscount.remaining < 0) {
      throw new BadRequestException('this promotion is run out');
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
}
