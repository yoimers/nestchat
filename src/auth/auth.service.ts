import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(createAuthDto: CreateUserDto) {
    const findUser = await this.userService.getUser(createAuthDto.name);
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
      };
    }
  }
}
