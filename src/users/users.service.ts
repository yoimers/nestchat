import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // const x = await compare(
    //   createUserDto.password,
    //   '$2b$10$1Ty/vghwP9mdKdiHReLrKO51M02B5xNwLgwhZNfTeUD.a7j..Nxr.',
    // );
    // return x;
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
}

export const toHashPassword = async (password: string) => {
  if (!process.env.SALT) throw new NotImplementedException();
  const hashPassword = await hash(password, process.env.SALT);
  return hashPassword;
};
