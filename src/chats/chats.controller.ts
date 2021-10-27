import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { JwtChat } from './interface/jwt.interface';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createChatDto: CreateChatDto,
    @Req() { user: { userId } }: JwtChat,
  ) {
    if (userId !== createChatDto.userId) throw new BadRequestException();
    return this.chatsService.create(createChatDto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(':roomId')
  findOne(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Req() { user: { userId } }: JwtChat,
  ) {
    return this.chatsService.findMany(roomId, userId);
  }
}
