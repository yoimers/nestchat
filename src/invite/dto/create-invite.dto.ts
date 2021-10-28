import { IsString } from 'class-validator';

export class CreateInviteDto {
  @IsString()
  inviteUserId!: string;
}
