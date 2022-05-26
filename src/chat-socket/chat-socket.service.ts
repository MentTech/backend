import { Injectable } from '@nestjs/common';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class ChatSocketService {
  constructor(private readonly chatService: ChatService) {}

  sendMessage(roomId: number, userId: number, message: string) {
    return this.chatService.createMessage(roomId, userId, message);
  }
}
