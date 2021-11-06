import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { WebsocketService } from './websocket.service';
import { Server, Socket } from 'socket.io';
import {
  ChatWebsocketDto,
  HomeWebsocketDto,
  InviteResultWebsocketDto,
} from './dto/home-websocket.dto';

@WebSocketGateway({
  cors: {
    origin: 'https://nextchat-omega.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
  },
})
export class WebsocketGateway implements OnGatewayInit {
  constructor(private readonly websocketService: WebsocketService) {}

  afterInit(server: Server) {
    this.websocketService.afterInit(server);
  }
  //接続時の処理
  handleConnection(@ConnectedSocket() client: Socket) {
    return this.websocketService.handleConnection(client);
  }
  //切断時の処理
  handleDisconnect(@ConnectedSocket() client: Socket) {
    return this.websocketService.handleDisconnect(client);
  }
  //ログイン中のユーザー取得
  @SubscribeMessage('HomeJoin')
  HomeJoin(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    return this.websocketService.homeJoin(data, client);
  }

  //ユーザー招待処理
  @SubscribeMessage('Invite')
  Invite(
    @MessageBody() data: HomeWebsocketDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.websocketService.invite(data, client);
  }
  //招待レスポンス対応
  @SubscribeMessage('InviteResult')
  InviteResult(
    @MessageBody() data: InviteResultWebsocketDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.websocketService.inviteresult(data, client);
  }
  //チャットルーム処理
  @SubscribeMessage('chatroom')
  chatroom(
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    return this.websocketService.chatroom(roomId, client);
  }

  //チャット送信
  @SubscribeMessage('chat')
  chat(
    @MessageBody() data: ChatWebsocketDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.websocketService.chat(data, client);
  }
}
