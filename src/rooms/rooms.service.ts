import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}
  async create(createRoomDto: CreateRoomDto) {
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

  async findOne(roomId: string, userId: string) {
    const validate = await this.isUserInRoom(roomId, userId);
    if (!validate) throw new NotFoundException();
    return this.prisma.room.findFirst({
      where: {
        id: validate.roomId,
        published: true,
      },
      include: {
        sendChats: true,
      },
    });
  }
  async findUserRoomOne(toUserId: string, userId: string) {
    return this.prisma.room.findMany({
      where: {
        published: true,
        AND: [
          {
            UserRoom: {
              some: {
                userId,
              },
            },
          },
          {
            UserRoom: {
              some: {
                userId: toUserId,
              },
            },
          },
        ],
      },
    });
  }
  async attendUser(roomId: string) {
    return this.prisma.user.findMany({
      where: {
        joinRoom: {
          some: {
            roomId,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async update(roomId: string, userId: string) {
    const validate = await this.isUserInRoom(roomId, userId);
    if (!validate) throw new ForbiddenException();
    return this.prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        published: false,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
  async isUserInRoom(roomId: string, userId: string) {
    const isInRoom = await this.prisma.userInRoom.findFirst({
      where: {
        roomId,
        userId,
      },
    });
    if (isInRoom) {
      return isInRoom;
    }
    return false;
  }
}
