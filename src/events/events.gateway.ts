import { subject } from '@casl/ability';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

// import { SocketJwtGuard } from '@caster/authn/socket-jwt.guard';
// import { Ability, Censor } from '@caster/authz/authz.decorators';
// import { SocketAuthzGuard } from '@caster/authz/socket-authz.guard';
// import { Action, AppAbility, CensorFields } from '@caster/authz/authz.types';
// import { RequestUser } from '@caster/users/user.decorators';
// import { UserWithProfile } from '@caster/users/user.types';

import { ClientRegister, EventTypes, MessageSend } from './event.types';
import { ChannelService } from './channel.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  // path: '/chat',
  namespace: '/pubsub',
})
// @UseGuards(SocketJwtGuard, SocketAuthzGuard)
export class EventsGateway implements OnGatewayInit, OnGatewayConnection {
  private readonly logger = new Logger(EventsGateway.name);

  constructor(private readonly service: ChannelService) {}

  @SubscribeMessage(EventTypes.ClientRegister)
  async clientRegister(
    @MessageBody() event: ClientRegister,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      await this.service.registerClient(event, socket);
    } catch (error) {
      throw new WsException((error as Error).message);
    }
  }

  @SubscribeMessage(EventTypes.MessageSend)
  async messageSend(@MessageBody() event: MessageSend) {
    // Check for authorization

    try {
      await this.service.sendMessage(event);
    } catch (error) {
      throw new WsException((error as Error).message);
    }
  }

  afterInit() {
    this.logger.log('WebSocket initialized');
  }

  handleConnection(socket: Socket) {
    this.logger.log(`Connection: ${socket.id}`);
  }
}
