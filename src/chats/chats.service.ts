import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatsService {
  constructor(private readonly prisma: PrismaService) {}

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

  findMany(roomId: string) {
    return this.prisma.chat.findMany({
      where: {
        roomId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
