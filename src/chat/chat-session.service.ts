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
    if (session.done) {
      throw new ForbiddenException('Session already done');
    }
    let chatRoom = session.chatRoom;
    if (!session.chatRoom) {
      chatRoom = await this.prisma.chatRoom.create({
        data: {
          name: session.program.title,
          session: {
            connect: {
              id: session.id,
            },
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
