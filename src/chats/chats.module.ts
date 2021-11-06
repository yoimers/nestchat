import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { PrismaService } from 'src/prisma.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [RoomsModule],
  controllers: [ChatsController],
  providers: [ChatsService, PrismaService, RoomsService],
  exports: [ChatsService],
})
export class ChatsModule {}
