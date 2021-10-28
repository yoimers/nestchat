import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roomsService: RoomsService,
  ) {}

  create(createChatDto: CreateChatDto) {
    return this.prisma.chat
      .create({
        data: {
          ...createChatDto,
        },
      })
      .catch((e) => {
        throw new BadRequestException(e.code);
      });
  }

  async findMany(roomId: string, userId: string) {
    const isUserInRoom = await this.roomsService.isUserInRoom(roomId, userId);
    if (!isUserInRoom) throw new UnauthorizedException();
    return this.prisma.chat.findMany({
      where: {
        roomId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 30,
    });
  }
}
