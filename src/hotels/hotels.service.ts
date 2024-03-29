import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Hotel, Prisma } from '@prisma/client';
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
      throw new BadRequestException();
    }
  }
  async getAll(): Promise<Hotel[]> {
    try {
      const hotels = await this.prisma.hotel.findMany();
      return hotels;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
