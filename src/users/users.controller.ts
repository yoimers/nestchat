import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
  Get,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Answer, CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtChat } from 'src/chats/interface/jwt.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  get() {
    return this.usersService.get();
  }

  //ok
  @UseGuards(AuthGuard('jwt'))
  @Post('invite/reply/:inviteId')
  acceptreject(
    @Body() { isAccept }: Answer,
    @Param('inviteId') inviteId: string,
    @Req() { user: { userId } }: JwtChat,
  ) {
    return this.usersService.acceptreject(inviteId, userId, isAccept);
  }

  //ok
  @UseGuards(AuthGuard('jwt'))
  @Get('invite/:userId')
  findAll(@Param('userId') userId: string, @Req() { user }: JwtChat) {
    if (userId !== user.userId) throw new ForbiddenException();
    return this.usersService.findAll(userId);
  }

  //ok
  @UseGuards(AuthGuard('jwt'))
  @Post('invite/:toId')
  invite(@Param('toId') toId: string, @Req() { user: { userId } }: JwtChat) {
    return this.usersService.invite(toId, userId);
  }
}
