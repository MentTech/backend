import { Module } from '@nestjs/common';
import { ChatModule } from '../chat/chat.module';
import { ChatSocketService } from './chat-socket.service';

@Module({
  imports: [ChatModule],
  providers: [ChatSocketService],
  exports: [ChatSocketService],
})
export class ChatSocketModule {}
