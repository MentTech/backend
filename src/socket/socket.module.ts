import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { SocketNotificationService } from './socket-notification.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { SocketChatService } from './socket-chat.service';
import { ChatSocketModule } from '../chat-socket/chat-socket.module';

@Module({
  imports: [AuthModule, PrismaModule, ChatSocketModule],
  providers: [
    SocketService,
    SocketGateway,
    SocketNotificationService,
    SocketChatService,
  ],
  exports: [SocketNotificationService, SocketChatService, SocketService],
})
export class SocketModule {}
