import { Redis } from 'ioredis';
import { Socket } from 'socket.io';

// import { CensorFields } from '@caster/authz/authz.types';
// import { ProfileWithUser } from '@caster/users/profiles/profile.utils';

import { Abstract, Type } from '@nestjs/common';
import { Consumer, Producer } from 'kafkajs';

export type InjectionToken<T = unknown> =
  | string
  | symbol
  | Type<T>
  | Abstract<T>;

export const EventTypes = {
  ClientRegister: 'client-register',
  ClientRegistered: 'client-registered',
  Ping: 'ping',
  MessageSend: 'message-send',
  MessageReceive: 'message-receive',
  IncommingKafkaMessage: 'incomming-kafka',
} as const;

export type EventTypes = typeof EventTypes[keyof typeof EventTypes];

export interface ClientRegister {
  episodeId: string;
  profileId: string;
}

export interface MessageSend {
  episodeId: string;
  text: string;
}

export interface MessageReceive {
  episodeId: string;
  //   sender: ProfileWithUser;
  text: string;
}

/**
 * Redis Event Bus
 */
export const KafkaProducer: InjectionToken<Producer> =
  'KAFSOCKETS_KAFKAJS_PRODUCER';

export const KafkaConsumer: InjectionToken<Consumer> =
  'KAFSOCKETS_KAFKAJS_CONSUMER';

export interface MessageContext {
  episodeId: string;
  //   censor: CensorFields;
  socket: Socket;
}

/**
 * A chat message send on a Redis channel
 */
export interface ChatMessage {
  sender: {
    profileId: string;
  };
  text: string;
}
