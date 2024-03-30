import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Hotel, Prisma } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HotelsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.HotelCreateInput): Promise<Hotel> {
    try {
      const hotel = await this.prisma.hotel.create({
        data,
      });
      return hotel;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('There is some missing fields.');
      }
      throw new InternalServerErrorException(error);
    }
  }
  async getAll(): Promise<Hotel[]> {
    try {
      const hotels = await this.prisma.hotel.findMany({
        include: { rooms: true, Booking: true },
      });
      return hotels;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async update(data: Prisma.HotelUpdateInput, id: number): Promise<Hotel> {
    try {
      const hotel = await this.prisma.hotel.update({
        where: {
          id: id,
        },
        data: data,
      });
      return hotel;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Hotel not found');
        }
      }
      throw new InternalServerErrorException(error);
    }
  }
}
