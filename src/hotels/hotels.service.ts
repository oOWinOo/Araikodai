import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Hotel, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HotelInputCreate, HotelInputUpdate } from './hotels.dto';

@Injectable()
export class HotelsService {
  constructor(private prisma: PrismaService) {}

  async create(data: HotelInputCreate): Promise<Hotel> {
    const hotel = await this.prisma.hotel.create({
      data,
    });
    return hotel;
  }
  async getAll(): Promise<Hotel[]> {
    const hotels = await this.prisma.hotel.findMany({
      include: { rooms: true, Booking: true },
    });
    return hotels;
  }
  async getByName(name: string): Promise<Hotel[]> {
    const hotels = await this.prisma.hotel.findMany({
      where: {
        name: name,
      },
      include: { rooms: true, Booking: true },
    });
    return hotels;
  }

  async update(data: HotelInputUpdate, id: number): Promise<Hotel> {
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
          throw new NotFoundException(`Hotel id : ${id} is not valid`);
        }
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException(`Bad request some field is not valid`);
      }
    }
  }
}
