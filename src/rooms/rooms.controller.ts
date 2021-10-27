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
import { UpdateRoomDto } from './dto/update-room.dto';
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

  @Get(':roomId')
  findOne(@Param('roomId') roomId: string) {
    return this.roomsService.findOne(roomId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(+id, updateRoomDto);
  }
}
