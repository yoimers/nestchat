import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}
  async create(createRoomDto: CreateRoomDto) {
    console.log(createRoomDto);
    const Room = await this.prisma.room
      .create({
        data: {
          roomName: createRoomDto.roomName,
        },
      })
      .catch((e) => {
        throw new BadRequestException(e.code);
      });

    return this.prisma.userInRoom
      .create({
        data: {
          userId: createRoomDto.userId,
          roomId: Room.id,
        },
      })
      .catch((e) => {
        throw new BadRequestException(e.code);
      });
  }

  findOne(roomId: string) {
    return `This action returns a #${roomId} room`;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
  async isUserInRoom(roomId: string, userId: string): Promise<boolean> {
    const isInRoom = await this.prisma.userInRoom.findFirst({
      where: {
        roomId,
        userId,
      },
    });
    if (isInRoom) {
      return true;
    }
    return false;
  }
}
