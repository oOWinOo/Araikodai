import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Room } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomCreateType, RoomUpdateType } from './rooms.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async create(data: RoomCreateType): Promise<Room> {
    const room = await this.prisma.room.create({
      data: {
        name: data.name,
        description: data.description ?? '',
        imageURL: data.imageURL,
        price: data.price,
        occupancy: data.occupancy,
        Hotel: { connect: { id: data.hotelId } },
      },
    });
    return room;
  }

  async getAll(): Promise<Room[]> {
    const rooms = await this.prisma.room.findMany({
      include: {
        booking: true,
      },
    });
    return rooms;
  }

  async getFromHotelId(id: number): Promise<Room[]> {
    const rooms = await this.prisma.room.findMany({
      where: { hotelId: id },
    });
    return rooms;
  }
  async editRoom(data: RoomUpdateType, roomId: number): Promise<Room> {
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
  }
  async deleteRoom(roomId: number) {
    const room = await this.prisma.room.findFirst({
      where: {
        id: roomId,
      },
    });
    if (!room) {
      throw new NotFoundException(
        `Room with room_id : ${roomId} does not exist`,
      );
    }
    await this.prisma.room.delete({
      where: {
        id: roomId,
      },
    });
    return {
      message: `Success to delete room with ID ${roomId}`,
    };
  }
}
