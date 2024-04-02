import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { DiscountReturn } from './discount.dto';

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
  async applyDiscount(id: number, userId: number): Promise<DiscountReturn> {
    const remainingDiscount = await this.prisma.discount.findUnique({
      where: {
        id: id,
      },
    });
    if (!remainingDiscount) {
      throw new BadRequestException(`Discount with ID ${id} is invalid.`);
    }
    if (remainingDiscount.remaining <= 0) {
      throw new BadRequestException('this promotion is run out');
    }
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        booking: {
          where: {
            discountId: {
              not: {
                equals: null,
              },
            },
          },
        },
      },
    });
    if (user.booking.length >= 3) {
      throw new BadRequestException(`User already used 3 discounts.`);
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
      this.prisma.discount.update({
        data: {
          remaining: remainingDiscount.remaining - 1,
        },
        where: {
          id,
        },
      }),
    ]);
    const result: DiscountReturn = {
      discountId: remainingDiscount.id,
      value: remainingDiscount.value,
    };
    return result;
  }
  async userDiscountQuota(userId: number) {
    const remainingDiscountOfUser = await this.prisma.booking.findMany({
      where: {
        userId: userId,
        discountId: {
          not: {
            equals: null,
          },
        },
      },
    });

    if (remainingDiscountOfUser.length > 3) {
      throw new InternalServerErrorException(
        `user break using limit by using ${remainingDiscountOfUser}`,
      );
    }
    return 3 - remainingDiscountOfUser.length;
  }

  async changeDiscount(
    oldDiscountId: number,
    newDiscountId: number,
    userId: number,
  ) {
    const newDiscount = await this.prisma.discount.findUnique({
      where: {
        id: newDiscountId,
      },
    });
    const oldDiscount = await this.prisma.discount.findUnique({
      where: {
        id: newDiscountId,
      },
    });
    if (!newDiscount) {
      throw new BadRequestException(
        `Discount with ID ${newDiscountId} is invalid.`,
      );
    }
    if (newDiscount.remaining <= 0) {
      throw new BadRequestException('this promotion is run out');
    }
    if (newDiscount.type.toLowerCase().includes('birthday')) {
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
      this.prisma.discount.update({
        data: {
          remaining: newDiscount.remaining - 1,
        },
        where: {
          id: newDiscountId,
        },
      }),
      this.prisma.discount.update({
        data: {
          remaining: oldDiscount.remaining + 1,
        },
        where: {
          id: oldDiscountId,
        },
      }),
    ]);
    const result: DiscountReturn = {
      discountId: newDiscount.id,
      value: newDiscount.value,
    };
    return result;
  }
}
