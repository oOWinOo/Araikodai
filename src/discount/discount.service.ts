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
    // try {
    const updatedDiscount = await this.prisma.discount.update({
      where: {
        id,
      },
      data,
    });
    return updatedDiscount;
    // } catch (err) {
    //   if (err instanceof Prisma.PrismaClientKnownRequestError) {
    //     if (err.code === 'P2025') {
    //       throw new NotFoundException(`discount id ${id} not found`);
    //     }
    //   }
    //   throw new InternalServerErrorException();
    // }
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
