import { Injectable } from '@nestjs/common';
import { SocketService } from './socket.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SocketChatService {
  constructor(
    private readonly socketService: SocketService,
    private readonly prisma: PrismaService,
  ) {}

  sendMessage(userId: number, roomId: number, message: any) {
    const socket = this.socketService.fetchSocketWithUserId(userId);
    if (socket) {
      return;
    }
    this.socketService.sendEventToUser(userId, `chat:${roomId}`, message);
  }

  async sendMessageToRoom(roomId: number, senderId: number, message: any) {
    const room = await this.prisma.chatRoom.findFirst({
      where: {
        id: roomId,
      },
      select: {
        participants: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!room) {
      return;
    }
    const usersId = room.participants.map((participant) => participant.id);
    const usersToSend = usersId.filter((user) => user !== senderId);
    usersToSend.forEach((user) => this.sendMessage(user, roomId, message));
  }
}
