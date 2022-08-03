import {
  ConsoleLogger,
  DynamicModule,
  FactoryProvider,
  Logger,
  Module,
} from '@nestjs/common';
import Redis from 'ioredis';

import { EventsGateway } from './events.gateway';
import { Publisher, Subscriber } from './event.types';
import { ChannelService } from './channel.service';

export interface EventsOptions {
  url?: string;
}

export interface RedisSettings {
  publisher?: boolean;
}

/**
 * A Redis factory provider that can act as either a Cubscriber or a Publisher
 */
const redisProvider = (
  options: EventsOptions = {},
  settings: RedisSettings = {},
): FactoryProvider<Redis> => ({
  provide: settings.publisher ? Publisher : Subscriber,
  useFactory: () => new Redis(options.url),
});

/**
 * WebSocket event handling via the EventsGateway
 */
@Module({
  providers: [
    { provide: Logger, useClass: ConsoleLogger },
    EventsGateway,
    ChannelService,
  ],
})
export class EventsModule {
  static forRoot(options: EventsOptions = {}): DynamicModule {
    return {
      module: EventsModule,
      providers: [
        redisProvider(options),
        redisProvider(options, { publisher: true }),
      ],
    };
  }
}
