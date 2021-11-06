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
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly auth: AuthService,
  ) {}

  get() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const { name, password } = createUserDto;
    await this.prisma.user
      .create({
        data: {
          name,
          hashpassword: await toHashPassword(password),
        },
      })
      .catch((e) => {
        if (e.code !== 'P2002') {
          throw new InternalServerErrorException(e.code);
        }
        return null;
      });
    const token = (await this.auth.login({
      name,
      password,
    })) || { access_token: '', id: '' };
    return {
      name,
      ...token,
    };
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

  async invite(toId: string, userId: string, roomId?: string) {
    const validate = await this.findAll(toId);
    const vali = validate.find((d) => d.roomId === roomId);
    if (vali) throw new ForbiddenException('Already invited');
    return this.prisma.invite.create({
      data: {
        fromId: userId,
        toId,
        roomId,
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
      if (!validate.roomId) {
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
        return this.prisma
          .$transaction([deleteInvite, createRoom])
          .catch((e) => {
            throw new InternalServerErrorException(e.code);
          });
      } else {
        const createuserInRoom = this.prisma.userInRoom.create({
          data: {
            userId,
            roomId: validate.roomId as string,
          },
        });
        return this.prisma
          .$transaction([deleteInvite, createuserInRoom])
          .catch((e) => {
            throw new InternalServerErrorException(e.code);
          });
      }
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
        select: {
          id: true,
          fromId: true,
          toId: true,
          roomId: true,
          from: {
            select: {
              name: true,
            },
          },
        },
      })
      .then((data) => {
        return data.map((d) => ({
          id: d.id,
          toId: d.toId,
          fromId: d.fromId,
          name: d.from.name,
          roomId: d.roomId,
        }));
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
