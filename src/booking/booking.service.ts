import { BadRequestException, Injectable } from '@nestjs/common';
import { Booking } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingInputCreate, BookingInputUpdate } from './booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(data: BookingInputCreate, userId: number): Promise<Booking> {
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
    const booking = await this.prisma.booking.create({
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
        totalPrice: room.price * data.dayNum,
        startdate: data.entryDate,
        endDate: lastDate,
        person: data.person,
        bookingDays: data.dayNum,
      },
    });
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
        totalPrice: room.price * data.dayNum,
        startdate: data.entryDate,
        endDate: lastDate,
        person: data.person,
        bookingDays: data.dayNum,
      },
    });
  }
  async delete(bookingId: number) {
    return this.prisma.booking.delete({
      where: {
        id: bookingId,
      },
    });
  }

  async getAllAdmin() {
    return this.prisma.booking.findMany();
  }

  async getAllByUser(userId: number) {
    return this.prisma.booking.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async getById(bookingId: number) {
    const booking = await this.prisma.booking.findFirst({
      where: {
        id: bookingId,
      },
    });
    if (!booking) {
      throw new BadRequestException(`No booking with ID ${bookingId}`);
    }
    return booking;
  }
}
