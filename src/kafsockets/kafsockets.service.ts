import { Inject, Logger } from '@nestjs/common';
import { Consumer, EachMessagePayload, Producer } from 'kafkajs';
import {
  KafkaConsumer,
  KafkaProducer,
  MessageSend,
  ClientRegister,
  EventTypes,
  MessageReceive,
  MessageContext,
} from './kafsockets.types';
import { Socket } from 'socket.io';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class KafChannelService {
  private readonly logger = new Logger(KafChannelService.name);

  constructor(
    @Inject(KafkaProducer) private readonly producer: Producer,
    @Inject(KafkaConsumer) private readonly consumer: Consumer,
    private eventEmitter: EventEmitter2,
  ) {
    this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        this.eventEmitter.emit(EventTypes.IncommingKafkaMessage, payload);
      },
    });
  }

  sendMessage = async (event: MessageSend) => {
    const chatMessage = {
      text: event.text,
    };
    const result = await this.producer.send({
      topic: 'Users',
      messages: [
        {
          value: JSON.stringify(chatMessage),
        },
      ],
    });
    this.logger.log(JSON.stringify(result));
  };

  registerClient = async (event: ClientRegister, socket: Socket) => {
    const context = { episodeId: event.episodeId, socket };
    this.eventEmitter.on(
      EventTypes.IncommingKafkaMessage,
      this.handleMessage(context),
    );
  };

  handleMessage =
    (context: MessageContext) =>
    async ({
      topic,
      partition,
      message,
      heartbeat,
      pause,
    }: EachMessagePayload): Promise<void> => {
      const { episodeId, socket } = context;
      const { text } = JSON.parse(message.value.toString());

      if (!text) {
        this.logger.error(
          `Error: Message received on channel "${topic}" with no text - ${JSON.stringify(
            message,
          )}`,
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
