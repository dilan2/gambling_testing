import Redis from 'ioredis';
import { Socket } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import { subject } from '@casl/ability';

// import {ProfilesService} from '@caster/users/profiles/profiles.service'
// import {fieldOptions} from '@caster/users/profiles/profile.utils'
// import {CensorFields} from '@caster/authz/authz.types'

import {
  ChatMessage,
  ClientRegister,
  EventTypes,
  MessageContext,
  MessageReceive,
  MessageSend,
  Publisher,
  Subscriber,
} from './event.types';

export class ChannelService {
  private readonly logger = new Logger(ChannelService.name);

  constructor(
    @Inject(Publisher) private readonly publisher: Redis,
    @Inject(Subscriber) private readonly subscriber: Redis,
  ) {}

  registerClient = async (
    event: ClientRegister,
    socket: Socket,
  ): Promise<void> => {
    const context = { episodeId: event.episodeId, socket };

    this.subscriber.on('message', this.handleMessage(context));

    this.subscriber.subscribe(`ep:${event.episodeId}`, (err, _count) => {
      if (err) {
        this.logger.error(
          `Error during Redis subscribe for profileId - ${event.profileId}, channel - "ep:${event.episodeId}"`,
          err,
        );

        return;
      }
    });

    // Acknowledge that the client was registered
    socket.emit(EventTypes.ClientRegistered, event);
  };

  sendMessage = async (event: MessageSend) => {
    const chatMessage = {
      text: event.text,
    };

    this.publisher.publish(
      `ep:${event.episodeId}`,
      JSON.stringify(chatMessage),
    );
  };

  /**
   * Handle Redis pub/sub events for the given WebSocket client.
   */
  handleMessage =
    (context: MessageContext) =>
    async (
      channel: string | Buffer,
      message: string | Buffer,
    ): Promise<void> => {
      const { episodeId, socket } = context;
      const { text, sender }: Partial<ChatMessage> = JSON.parse(`${message}`);

      if (!text) {
        this.logger.error(
          `Error: Message received on channel "${channel}" with no text - ${message}`,
        );

        return;
      }

      const receiveEvent: MessageReceive = {
        episodeId,
        // sender,
        text,
      };

      socket.emit(EventTypes.MessageReceive, receiveEvent);
    };
}
