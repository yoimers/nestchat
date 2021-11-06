import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtChat } from 'src/chats/interface/jwt.interface';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createRoomDto: CreateRoomDto,
    @Req() { user: { userId } }: JwtChat,
  ) {
    return this.roomsService.create({ ...createRoomDto, userId });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':roomId')
  findOne(
    @Param('roomId') roomId: string,
    @Req() { user: { userId } }: JwtChat,
  ) {
    return this.roomsService.findOne(roomId, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/user/:toUserId')
  findUserRoomOne(
    @Param('toUserId') toUserId: string,
    @Req() { user: { userId } }: JwtChat,
  ) {
    return this.roomsService.findUserRoomOne(toUserId, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/attend/:roomId')
  attendUser(@Param('roomId') roomId: string) {
    return this.roomsService.attendUser(roomId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':roomId')
  update(
    @Param('roomId') roomId: string,
    @Req() { user: { userId } }: JwtChat,
  ) {
    return this.roomsService.update(roomId, userId);
  }
}
