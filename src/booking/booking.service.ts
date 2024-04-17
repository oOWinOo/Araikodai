import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Booking } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingInputCreate, BookingInputUpdate } from './booking.dto';
import { DiscountService } from 'src/discount/discount.service';
import { DiscountReturn } from 'src/discount/discount.dto';
@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private discountServices: DiscountService,
  ) {}

  async create(data: BookingInputCreate, userId: number): Promise<Booking> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        booking: true,
      },
    });
    if (!user) {
      throw new BadRequestException(`user with ID ${userId} i not valid`);
    }
    let sumDay: number = 0;
    for (const booking of user.booking) {
      sumDay += booking.bookingDays;
    }
    if (sumDay + data.dayNum > 3) {
      throw new BadRequestException(
        `You already have ${sumDay} nights booked. You have only ${3 - sumDay} remaining nights for booking.`,
      );
    }
    const lastDate = new Date(data.entryDate);
    lastDate.setDate(lastDate.getDate() + data.dayNum - 1);
    const room = await this.prisma.room.findFirst({
      where: {
        id: data.roomId,
      },
      include: {
        booking: {
          where: {
            AND: {
              startdate: {
                lte: lastDate,
              },
              endDate: {
                gte: data.entryDate,
              },
            },
          },
        },
      },
    });
    if (!room) {
      throw new BadRequestException(
        `The room with ID ${data.roomId} is invalid.`,
      );
    }
    if (room.booking.length != 0) {
      throw new BadRequestException(
        `The room with ID ${data.roomId} is not available for Date ${data.entryDate} to ${lastDate}.`,
      );
    }
    if (room.occupancy < data.person) {
      throw new BadRequestException(
        `The room with ID ${data.roomId} is designed to accommodate a maximum of ${room.occupancy} people, yet you have ${data.person} people.`,
      );
    }
    let totalPrice: number = room.price * data.dayNum;
    let booking: Booking;
    if (data.discountId) {
      const discount = await this.discountServices.applyDiscount(
        data.discountId,
        userId,
      );
      totalPrice = Math.floor((totalPrice * (100 - discount.value)) / 100);
      booking = await this.prisma.booking.create({
        data: {
          Hotel: {
            connect: {
              id: room.hotelId,
            },
          },
          Room: {
            connect: {
              id: data.roomId,
            },
          },
          User: {
            connect: {
              id: userId,
            },
          },
          Discount: {
            connect: {
              id: data.discountId,
            },
          },
          totalPrice: totalPrice,
          startdate: data.entryDate,
          endDate: lastDate,
          person: data.person,
          bookingDays: data.dayNum,
        },
      });
    } else {
      booking = await this.prisma.booking.create({
        data: {
          Hotel: {
            connect: {
              id: room.hotelId,
            },
          },
          Room: {
            connect: {
              id: data.roomId,
            },
          },
          User: {
            connect: {
              id: userId,
            },
          },
          totalPrice: totalPrice,
          startdate: data.entryDate,
          endDate: lastDate,
          person: data.person,
          bookingDays: data.dayNum,
        },
      });
    }

    return booking;
  }

  async edit(bookingId: number, raw: BookingInputUpdate): Promise<Booking> {
    const oldBooking = await this.prisma.booking.findFirst({
      where: {
        id: bookingId,
      },
    });
    if (!oldBooking) {
      throw new BadRequestException(
        `The book with ID ${bookingId} is invalid.`,
      );
    }
    const data = {
      roomId: raw.roomId ?? oldBooking.roomId,
      dayNum: raw.dayNum ?? oldBooking.bookingDays,
      entryDate: raw.entryDate ?? oldBooking.startdate,
      person: raw.person ?? oldBooking.person,
    };
    const user = await this.prisma.user.findFirst({
      where: {
        id: oldBooking.userId,
      },
      include: {
        booking: true,
      },
    });
    if (!user) {
      throw new InternalServerErrorException(
        `User with ID ${oldBooking.userId} in booking with ID ${bookingId} is invalid.`,
      );
    }
    let sumDay: number = 0;
    for (const booking of user.booking) {
      if (booking.id != bookingId) {
        sumDay += booking.bookingDays;
      }
    }
    if (sumDay + data.dayNum > 3) {
      throw new BadRequestException(
        `You already have ${sumDay} nights booked. You have only ${3 - sumDay} remaining nights for booking.`,
      );
    }
    const lastDate = new Date(data.entryDate);
    lastDate.setDate(lastDate.getDate() + data.dayNum - 1);
    const room = await this.prisma.room.findFirst({
      where: {
        id: data.roomId,
      },
      include: {
        booking: {
          where: {
            AND: {
              startdate: {
                lte: lastDate,
              },
              endDate: {
                gte: data.entryDate,
              },
              id: {
                not: {
                  equals: bookingId,
                },
              },
            },
          },
        },
      },
    });
    if (!room) {
      throw new BadRequestException(`The room id: ${data.roomId} is invalid.`);
    }
    if (room.booking.length != 0) {
      throw new BadRequestException(
        `The room with ID ${data.roomId} is not available for Date ${data.entryDate} to ${lastDate}.`,
      );
    }
    if (room.occupancy < data.person) {
      throw new BadRequestException(
        `The room with ID ${data.roomId} is designed to accommodate a maximum of ${room.occupancy} people, yet you have ${data.person} people.`,
      );
    }
    let totalPrice: number = room.price * data.dayNum;
    if (raw.discountId) {
      let discount: DiscountReturn;
      if (!oldBooking.discountId) {
        discount = await this.discountServices.applyDiscount(
          raw.discountId,
          oldBooking.userId,
        );
        totalPrice = Math.floor((totalPrice * (100 - discount.value)) / 100);
      } else {
        discount = await this.discountServices.changeDiscount(
          oldBooking.discountId,
          raw.discountId,
          oldBooking.userId,
        );
        totalPrice = Math.floor((totalPrice * (100 - discount.value)) / 100);
      }
      return this.prisma.booking.update({
        where: {
          id: bookingId,
        },
        data: {
          Hotel: {
            connect: {
              id: room.hotelId,
            },
          },
          Room: {
            connect: {
              id: data.roomId,
            },
          },
          Discount: {
            connect: {
              id: raw.discountId,
            },
          },
          totalPrice: totalPrice,
          startdate: data.entryDate,
          endDate: lastDate,
          person: data.person,
          bookingDays: data.dayNum,
        },
      });
    }
    return this.prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        Hotel: {
          connect: {
            id: room.hotelId,
          },
        },
        Room: {
          connect: {
            id: data.roomId,
          },
        },
        totalPrice: totalPrice,
        startdate: data.entryDate,
        endDate: lastDate,
        person: data.person,
        bookingDays: data.dayNum,
      },
    });
  }
  async delete(bookingId: number) {
    await this.prisma.booking.delete({
      where: {
        id: bookingId,
      },
    });
    return {
      message: `Success to delete booking with ID ${bookingId}`,
    };
  }

  async getAllAdmin() {
    return this.prisma.booking.findMany({
      include: {
        Hotel: true,
        Room: true,
        User: true,
        Discount: true,
      },
    });
  }

  async getAllByUser(userId: number) {
    return this.prisma.booking.findMany({
      where: {
        userId: userId,
      },
      include: {
        Hotel: true,
        Room: true,
        Discount: true,
      },
    });
  }

  async getById(bookingId: number) {
    const booking = await this.prisma.booking.findFirst({
      where: {
        id: bookingId,
      },
      include: {
        Hotel: true,
        Room: true,
        Discount: true,
      },
    });
    if (!booking) {
      throw new BadRequestException(`No booking with ID ${bookingId}`);
    }
    return booking;
  }
}
