import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { InviteService } from './invite.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtChat } from 'src/chats/interface/jwt.interface';

@Controller('invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createInviteDto: CreateInviteDto,
    @Req() { user: { userId } }: JwtChat,
  ) {
    return this.inviteService.create(createInviteDto);
  }

  @Post()
  acceptreject(
    @Body() createInviteDto: CreateInviteDto,
    @Req() { user: { userId } }: JwtChat,
  ) {
    return this.inviteService.acceptreject(createInviteDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Req() { user: { userId } }: JwtChat) {
    console.log('aa');
    return this.inviteService.findAll();
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(':userId')
  findOne(@Param('userId') userId: string, @Req() { user }: JwtChat) {
    return this.inviteService.findOne(userId);
  }
}
