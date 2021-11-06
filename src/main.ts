import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({
    origin: ['http://localhost:3000', 'https://nextchat-omega.vercel.app'],
    // origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    // preflightContinue: false,
    // allowedHeaders:
    //   'X-Requested-With, Origin, X-Csrftoken, Content-Type, Accept, authorization',
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8080, '0.0.0.0');
}
bootstrap();
