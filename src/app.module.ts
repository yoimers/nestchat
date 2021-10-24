import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [CatsModule, WebsocketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
