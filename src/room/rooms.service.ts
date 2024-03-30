import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Room } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomCreateType, RoomUpdateType } from './type';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async create(data: RoomCreateType): Promise<Room> {
    try {
      const room = await this.prisma.room.create({
        data: {
          name: data.name,
          description: data.description ?? '',
          imageURL: data.imageURL ?? '',
          price: data.price,
          occupancy: data.occupancy,
          Hotel: { connect: { id: data.hotelId } },
        },
      });
      return room;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('There is some missing detail.');
      }
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<Room[]> {
    try {
      const rooms = await this.prisma.room.findMany();
      return rooms;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getFromHotelId(id: number): Promise<Room[]> {
    try {
      console.log(id);
      const rooms = await this.prisma.room.findMany({
        where: { hotelId: id },
      });
      return rooms;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async editRoom(data: Prisma.RoomUpdateInput, roomId: number): Promise<Room> {
    try {
      const room = await this.prisma.room.findFirst({
        where: {
          id: roomId,
        },
        include: {
          booking: true,
        },
      });
      if (!room) {
        throw new NotFoundException(
          `Room with room_id : ${roomId} does not exist`,
        );
      }
      if (room.booking.length != 0) {
        throw new BadRequestException(
          `Room with room_id : ${roomId} already have booking you can not edit this room`,
        );
      }
      const updatedRoom = await this.prisma.room.update({
        where: {
          id: roomId,
        },
        data: data,
      });
      return updatedRoom;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
