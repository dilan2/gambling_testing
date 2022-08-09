import {
  ConsoleLogger,
  DynamicModule,
  FactoryProvider,
  Logger,
  Module,
} from '@nestjs/common';
import { Consumer, Kafka, Producer } from 'kafkajs';

import { KafsocketsGateway } from './kafsockets.gateway';
import { KafkaProducer, KafkaConsumer } from './kafsockets.types';
import { KafChannelService } from './kafsockets.service';
import { UsersModule } from '../users/users.module';

export interface EventsOptions {
  url?: string;
}

export interface BrokerClientSettings {
  producer?: boolean;
}

const redisProvider = (
  settings: BrokerClientSettings = {},
): FactoryProvider<Consumer | Producer> => ({
  provide: settings.producer ? KafkaProducer : KafkaConsumer,
  useFactory: async () => {
    const client = new Kafka({
      clientId: 'myapp',
      brokers: ['localhost:9092'],
    });

    if (settings.producer) {
      const producer = client.producer();
      await producer.connect();

      return producer;
    }
    const consumer = client.consumer({
      groupId: 'CORE',
    });

    await consumer.connect();
    await consumer.subscribe({
      topic: 'Users',
    });

    return consumer;
  },
});

@Module({
  providers: [
    { provide: Logger, useClass: ConsoleLogger },
    KafsocketsGateway,
    KafChannelService,
  ],
  imports: [UsersModule],
})
export class KafsocketsModule {
  static forRoot(): DynamicModule {
    return {
      module: KafsocketsModule,
      providers: [redisProvider(), redisProvider({ producer: true })],
    };
  }
}
