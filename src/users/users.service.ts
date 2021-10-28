import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Answer, CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user
      .create({
        data: {
          name: createUserDto.name,
          hashpassword: await toHashPassword(createUserDto.password),
        },
      })
      .catch((e) => {
        throw new BadRequestException(e.code);
      });
  }

  async getUser(name: string) {
    return this.prisma.user
      .findFirst({
        where: {
          name,
        },
      })
      .catch((e) => {
        throw new BadRequestException(e.code);
      })
      .then((result) => {
        if (!result) throw new NotFoundException();
        return result;
      });
  }

  async invite(toId: string, userId: string) {
    const validate = await this.findAll(toId);
    if (validate.length !== 0) throw new ForbiddenException('Already invited');
    console.log(validate);
    return this.prisma.invite.create({
      data: {
        fromId: userId,
        toId,
      },
    });
  }

  async acceptreject(
    inviteId: string,
    userId: string,
    isAccept: Answer['isAccept'],
  ) {
    if (isAccept) {
      const validate = await this.prisma.invite.findUnique({
        where: {
          id: inviteId,
        },
      });
      if (!validate) throw new NotFoundException();
      if (validate.toId !== userId) throw new ForbiddenException();
      const deleteInvite = this.prisma.invite.delete({
        where: {
          id: inviteId,
        },
      });
      const createRoom = this.prisma.room.create({
        data: {
          roomName: 'Room',
          UserRoom: {
            createMany: {
              data: [
                {
                  userId: validate.fromId,
                },
                {
                  userId: validate.toId,
                },
              ],
            },
          },
        },
      });
      return this.prisma.$transaction([deleteInvite, createRoom]).catch((e) => {
        throw new InternalServerErrorException(e.code);
      });
    } else {
      return this.prisma.invite
        .delete({
          where: {
            id: inviteId,
          },
        })
        .catch((e) => {
          throw new BadRequestException(e.code);
        });
    }
  }

  //Inviteされていたら返す
  findAll(userId: string) {
    return this.prisma.invite
      .findMany({
        where: {
          toId: userId,
        },
      })
      .catch((e) => {
        throw new BadRequestException(e.code);
      });
  }
}

export const toHashPassword = async (password: string) => {
  if (!process.env.SALT) throw new NotImplementedException();
  const hashPassword = await hash(password, process.env.SALT);
  return hashPassword;
};
