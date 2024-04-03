import { Injectable } from '@nestjs/common';
import { Hotel } from '@prisma/client';
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
    const hotel = await this.prisma.hotel.update({
      where: {
        id: id,
      },
      data: data,
    });
    return hotel;
  }

  async delete(hotelId: number) {
    await this.prisma.hotel.delete({
      where: {
        id: hotelId,
      },
    });
    return {
      message: `Success to delete hotel with ID ${hotelId}`,
    };
  }
}
