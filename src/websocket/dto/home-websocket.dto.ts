export class HomeWebsocketDto {
  id!: string;
  name!: string;
  toSocketId?: string;
  toId?: string;
  roomId?: string;
}
export class UserListWebsocketDto {
  socketId!: string;
  id!: string;
  name!: string;
}

export class InviteResultWebsocketDto {
  isAccept!: boolean;
  toSocketId!: string;
  fromName!: string;
  roomId?: string;
  roomName?: string;
}

export class ChatWebsocketDto {
  id!: string;
  content!: string;
  userId!: string;
  fromName!: string;
  roomId!: string;
  createdAt!: number;
}
