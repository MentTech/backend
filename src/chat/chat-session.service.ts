import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatSessionService {
  constructor(private readonly prisma: PrismaService) {}

  async getChatRoomInfoBySessionId(sessionId: number, userId: number) {
    const session = await this.prisma.programRegister.findFirst({
      where: {
        id: sessionId,
        OR: [
          {
            user: {
              id: userId,
            },
          },
          {
            program: {
              mentor: {
                userId,
              },
            },
          },
        ],
      },
      include: {
        program: {
          include: {
            mentor: true,
          },
        },
        user: true,
        chatRoom: true,
      },
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    if (!session.isAccepted) {
      throw new ForbiddenException('Session not accepted');
    }
    let chatRoom = session.chatRoom;
    if (!session.chatRoom) {
      if (session.done) {
        throw new ForbiddenException(
          'Session is already done and chatroom was never created',
        );
      }
      chatRoom = await this.prisma.chatRoom.create({
        data: {
          name: session.program.title,
          session: {
            connect: {
              id: session.id,
            },
          },
          participants: {
            connect: [
              {
                id: session.user.id,
              },
              {
                id: session.program.mentor.userId,
              },
            ],
          },
        },
      });
      return chatRoom;
    }
    return this.prisma.chatRoom.findFirst({
      where: {
        id: chatRoom.id,
      },
      select: {
        id: true,
        name: true,
        participants: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        isActive: true,
      },
    });
  }
}
