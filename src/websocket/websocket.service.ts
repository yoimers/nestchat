import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from 'src/chats/chats.service';
import { UsersService } from 'src/users/users.service';
import {
  ChatWebsocketDto,
  HomeWebsocketDto,
  InviteResultWebsocketDto,
  UserListWebsocketDto,
} from './dto/home-websocket.dto';

@Injectable()
export class WebsocketService {
  UserList: UserListWebsocketDto[] = [];
  @WebSocketServer()
  server!: Server;
  constructor(private users: UsersService, private chats: ChatsService) {}

  afterInit(server: Server) {
    this.server = server;
  }

  handleConnection(client: Socket) {
    client.join('HomeRoom');
    this.server.to('HomeRoom').emit('HomeJoinLeave', this.UserList);
  }

  handleDisconnect(client: Socket) {
    client.leave('HomeRoom');
    this.UserList = this.UserList.filter((d) => d.socketId !== client.id);
    this.server.to('HomeRoom').emit('HomeJoinLeave', this.UserList);
  }

  homeJoin(data: HomeWebsocketDto, client: Socket) {
    this.UserList.push({ socketId: client.id, ...data });
    this.server.to('HomeRoom').emit('HomeJoinLeave', this.UserList);
  }

  async invite(data: HomeWebsocketDto, client: Socket) {
    if (!data.toSocketId)
      throw new BadRequestException('toSocketIdを指定してください');
    if (!data.toId) throw new BadRequestException('toIdを指定してください');
    try {
      const result = await this.users.invite(data.toId, data.id, data.roomId);
      client.to(data.toSocketId).emit('Invite', {
        id: result.id,
        name: data.name,
        fromId: data.id,
        fromSocketId: client.id,
        roomId: data.roomId,
      });
    } catch (e) {
      throw new BadGatewayException(e);
    }
  }

  inviteresult(data: InviteResultWebsocketDto, client: Socket) {
    const { toSocketId, ...restData } = data;
    console.log('aaa');
    this.server.to(toSocketId).emit('inviteresult', {
      fromSocketId: client.id,
      ...restData,
    });
  }
  chatroom(roomId: string, client: Socket) {
    client.join(roomId);
  }

  chat(data: ChatWebsocketDto, client: Socket) {
    this.chats
      .create({
        content: data.content,
        userId: data.userId,
        roomId: data.roomId,
      })
      .then((d) =>
        client.broadcast.to(data.roomId).emit('chat', {
          ...data,
          id: d.id,
          createdAt: d.createdAt,
        }),
      );
  }
}
