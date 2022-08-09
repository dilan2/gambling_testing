import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { AppGateway } from './app.gateway';
import { ChatGateway } from './chat/chat.gateway';
import { EventsModule } from './events/events.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { KafsocketsModule } from './kafsockets/kafsockets.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://aragamble_local:aragamble@localhost:27017/',
      { useNewUrlParser: true },
    ),
    ProductsModule,
    EventsModule.forRoot({
      url: 'redis://localhost:6379',
    }),
    UsersModule,
    AuthModule,
    ConfigModule,
    KafsocketsModule.forRoot(),
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway, ChatGateway, JwtService],
})
export class AppModule {}
