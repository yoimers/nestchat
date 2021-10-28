import { Injectable } from '@nestjs/common';
import { CreateInviteDto } from './dto/create-invite.dto';

@Injectable()
export class InviteService {
  create(createInviteDto: CreateInviteDto) {
    return 'This action adds a new invite';
  }
  acceptreject(createInviteDto: CreateInviteDto) {
    return 'This action adds a new invite';
  }

  findAll() {
    return `This action returns all invite`;
  }

  findOne(userId: string) {
    return `This action returns a #${userId} invite`;
  }
}
