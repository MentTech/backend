import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { SocketNotificationService } from './socket-notification.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [SocketService, SocketGateway, SocketNotificationService],
  exports: [SocketNotificationService],
})
export class SocketModule {}
