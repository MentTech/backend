import { Injectable } from '@nestjs/common';
import { SocketService } from './socket.service';

@Injectable()
export class SocketNotificationService {
  constructor(private readonly socketService: SocketService) {}

  sendNotification(userId: number, data: any) {
    this.socketService.sendEventToUser(userId, 'notification', data);
  }
}
