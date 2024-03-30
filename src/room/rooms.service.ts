import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma, Room } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.RoomCreateInput): Promise<Room> {
    try {
      const room = await this.prisma.room.create({
        data,
      });
      return room;
    } catch (error) {
      console.log(error)
      throw new BadRequestException();
    }
  }
  async getAll(hotelId: number): Promise<Room[]> {
    try {
      const condition: Prisma.RoomWhereInput = {
        hotelId: hotelId,
      };
      const rooms = await this.prisma.room.findMany({
        where: condition,
      });
      return rooms;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
