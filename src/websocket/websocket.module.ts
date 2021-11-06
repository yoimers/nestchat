import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { WebsocketGateway } from './websocket.gateway';
import { UsersModule } from 'src/users/users.module';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [UsersModule, ChatsModule],
  providers: [WebsocketGateway, WebsocketService],
})
export class WebsocketModule {}
