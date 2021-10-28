import { IsBoolean, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  name!: string;
  @IsString()
  @Length(3, 20)
  password!: string;
}

export class CreateInviteDto {
  toId!: string;
}
export class Answer {
  @IsBoolean()
  isAccept!: boolean;
}
