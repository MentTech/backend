import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logger } from '@nestjs/common';
import { SocketService } from './socket.service';
import { AuthService } from '../auth/auth.service';
import * as _ from 'lodash';
import { SendMessageSocketDto } from './dto/send-message-socket.dto';
import { ChatSocketService } from '../chat-socket/chat-socket.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  constructor(
    private readonly socketService: SocketService,
    private readonly authService: AuthService,
    private readonly chatSocketService: ChatSocketService,
  ) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  @SubscribeMessage('auth:connect')
  async auth(
    @MessageBody() token: string,
    @ConnectedSocket() client: Socket,
  ): Promise<any> {
    const user = await this.authService.validateJwtToken(token);
    if (user) {
      client.join('authenticated');
      this.socketService.authenticatedId.push({
        id: client.id,
        userId: user.id,
      });
      this.logger.verbose(`User ${user.name} authenticated`);
      return 'Authenticated';
    }
    return 'Unauthorized';
  }

  @SubscribeMessage('auth:disconnect')
  async disconnect(
    @MessageBody() token: string,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    if (_.some(this.socketService.authenticatedId, ['id', client.id])) {
      this.socketService.authenticatedId =
        this.socketService.authenticatedId.filter(
          (item) => item.id !== client.id,
        );
      client.leave('authenticated');
      this.logger.verbose(`${client.id} exited`);
      return 'User disconnected';
    }
    return 'You are not authenticated';
  }

  @SubscribeMessage('chat:send_message')
  async sendMessage(
    @MessageBody() message: SendMessageSocketDto,
    @ConnectedSocket() client: Socket,
  ) {
    if (!this.socketService.checkSocketAuthenticated(client.id)) {
      return {
        status: 401,
        success: false,
        message: 'You are not authenticated',
      };
    }
    if (!message.roomId || !message.message) {
      return {
        status: 400,
        success: false,
        message: 'Bad request',
      };
    }
    const roomId = message.roomId;
    const userId = this.socketService.fetchUserIdWithSocketId(client.id);
    try {
      const data = await this.chatSocketService.sendMessage(
        roomId,
        userId,
        message.message,
      );
      return data;
    } catch (e) {
      return {
        status: 403,
        success: false,
        message: e.message,
      };
    }
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  afterInit(server: Server) {
    this.socketService.server = server;
  }

  handleDisconnect(client: Socket) {
    if (_.some(this.socketService.authenticatedId, ['id', client.id])) {
      this.socketService.authenticatedId =
        this.socketService.authenticatedId.filter(
          (item) => item.id !== client.id,
        );
      client.leave('authenticated');
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
