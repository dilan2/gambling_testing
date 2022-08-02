import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { AppGateway } from './app.gateway';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://aragamble_local:aragamble@localhost:27017/',
    ),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway, ChatGateway],
})
export class AppModule {}
