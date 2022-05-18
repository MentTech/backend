import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

export type SocketClient = {
  id: string;
  userId: number;
};

@Injectable()
export class SocketService {
  public server?: Server = undefined;
  public authenticatedId: SocketClient[] = [];

  fetchSocketWithUserId(userId: number): Socket | undefined {
    const socketClient = this.authenticatedId.find(
      (socketClient) => socketClient.userId === userId,
    );
    return this.server.of('/').sockets.get(socketClient.id);
  }

  fetchSocketArrayWithUserId(userId: number): Socket[] {
    const socketClients = this.authenticatedId.filter(
      (socketClient) => socketClient.userId === userId,
    );
    return socketClients.map((socketClient) =>
      this.server.of('/').sockets.get(socketClient.id),
    );
  }

  sendEventToUser(userId: number, event: string, data: any) {
    //const socket = this.fetchSocketWithUserId(userId);
    const sockets = this.fetchSocketArrayWithUserId(userId);
    if (sockets && sockets.length) {
      sockets.forEach((socket) => {
        socket.emit(event, data);
      });
    }
  }
}
