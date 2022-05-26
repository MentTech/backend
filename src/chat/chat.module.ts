import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SocketModule } from '../socket/socket.module';
import { ChatSessionService } from './chat-session.service';
import { NotificationModule } from '../notification/notification.module';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => SocketModule),
    forwardRef(() => NotificationModule),
  ],
  providers: [ChatSessionService, ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
