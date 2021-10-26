import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async login(createAuthDto: CreateAuthDto) {
    const findUser = await this.userService.getUser(createAuthDto.name);
    console.log(findUser);
    const isValid = await compare(
      createAuthDto.password,
      findUser.hashpassword,
    );
    if (!isValid) throw new UnauthorizedException();
    return isValid;
  }
}
