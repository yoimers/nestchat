import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async validateUser(createAuthDto: CreateUserDto) {
    const findUser = await this.prisma.user
      .findFirst({
        where: {
          name: createAuthDto.name,
        },
      })
      .catch((e) => {
        throw new BadRequestException(e.code);
      })
      .then((result) => {
        if (!result) throw new NotFoundException();
        return result;
      });

    const isValid = await compare(
      createAuthDto.password,
      findUser.hashpassword,
    );
    if (!isValid) throw new UnauthorizedException();
    return findUser.id;
  }

  async login(createAuthDto: CreateUserDto) {
    const userId = await this.validateUser(createAuthDto);
    if (userId) {
      const payload = { name: createAuthDto.name, userId };
      return {
        access_token: this.jwtService.sign(payload),
        id: userId,
      };
    }
    return null;
  }

  async check(access_token: string) {
    return this.jwtService.verifyAsync(access_token).catch((e) => {
      throw new BadRequestException('Expire!');
    });
  }
}
