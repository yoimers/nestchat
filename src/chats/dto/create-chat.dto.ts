import { Chat } from '.prisma/client';
import { IsString, IsUUID } from 'class-validator';

export class CreateChatDto {
  @IsString()
  content!: string;
  @IsUUID()
  userId!: string;
  @IsUUID()
  roomId!: string;
}

type A = keyof Chat;
