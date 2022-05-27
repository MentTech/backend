import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SocketService } from '../socket/socket.service';
import { SocketChatService } from '../socket/socket-chat.service';
import { SendNotificationService } from '../notification/send-notification.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly socketService: SocketService,
    private socketChatService: SocketChatService,
    private readonly sendNotificationService: SendNotificationService,
  ) {}

  async checkUserInRoom(roomId: number, userId: number) {
    const room = await this.prisma.chatRoom.findFirst({
      where: {
        id: roomId,
        participants: {
          some: {
            id: userId,
          },
        },
      },
    });
    return Boolean(room);
  }

  async getMessages(
    chatRoomId: number,
    userId: number,
    limit: number = 10,
    skip: number = 0,
  ) {
    if (!(await this.checkUserInRoom(chatRoomId, userId))) {
      throw new NotFoundException('Chat room not found');
    }
    return this.prisma.chatMessage.findMany({
      where: {
        room: {
          id: chatRoomId,
        },
      },
      take: limit,
      skip: skip,
      orderBy: {
        createAt: 'desc',
      },
    });
  }

  async createMessage(chatRoomId: number, userId: number, message: string) {
    const chatRoom = await this.prisma.chatRoom.findFirst({
      where: {
        id: chatRoomId,
        isActive: true,
        participants: {
          some: {
            id: userId,
          },
        },
      },
    });
    if (!chatRoom) {
      throw new ForbiddenException('Chat room not found or inactive');
    }
    const data = await this.prisma.chatMessage.create({
      data: {
        room: {
          connect: {
            id: chatRoomId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
        content: message,
      },
    });
    const notOnlineUser = await this.socketChatService.sendMessageToRoom(
      chatRoomId,
      userId,
      data,
    );
    if (notOnlineUser.length) {
      const pro = notOnlineUser.map((id) =>
        this.sendNotificationService.receiveMessageNotification(
          chatRoomId,
          userId,
          id,
        ),
      );
      await Promise.all(pro);
    }
    return data;
  }

  getMyRooms(userId: number) {
    return this.prisma.chatRoom.findMany({
      where: {
        participants: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  async getRoomInfo(roomId: number) {
    const room = await this.prisma.chatRoom.findFirst({
      where: {
        id: roomId,
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
    if (!room) {
      throw new NotFoundException('Chat room not found');
    }
    return room;
  }
}
