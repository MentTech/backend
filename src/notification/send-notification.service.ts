import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationTypeEnum } from './enum/notification-type.enum';
import { SocketNotificationService } from '../socket/socket-notification.service';

@Injectable()
export class SendNotificationService {
  private readonly logger = new Logger('SendNotificationService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly socketService: SocketNotificationService,
  ) {}

  async menteeRequestSession(sessionId: number) {
    const session = await this.prisma.programRegister.findFirst({
      where: { id: sessionId },
      include: {
        program: true,
      },
    });
    const { program, userId } = session;
    const mentorId = program.mentorId;
    try {
      const notification = await this.prisma.notification.create({
        data: {
          typeId: NotificationTypeEnum.MENTOR_RECEIVE_SESSION_REQUEST,
          actorId: userId,
          notifierId: mentorId,
          message: `${userId} has requested a session with you`,
          additional: {
            programId: program.id,
            sessionId: sessionId,
          },
        },
      });
      this.socketService.sendNotification(mentorId, notification);
      return notification;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async mentorAcceptSession(sessionId: number) {
    const session = await this.prisma.programRegister.findFirst({
      where: { id: sessionId },
      include: {
        program: true,
      },
    });
    const { userId, program } = session;
    try {
      const notification = await this.prisma.notification.create({
        data: {
          typeId: NotificationTypeEnum.MENTEE_SESSION_ACCEPTED,
          actorId: program.mentorId,
          notifierId: userId,
          message: `${program.mentorId} has accepted your session request`,
          additional: {
            programId: session.program.id,
            sessionId: sessionId,
          },
        },
      });
      this.socketService.sendNotification(userId, notification);
      return notification;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async mentorRejectSession(sessionId: number) {
    const session = await this.prisma.programRegister.findFirst({
      where: { id: sessionId },
      include: {
        program: true,
      },
    });
    const { userId, program } = session;
    try {
      const notification = await this.prisma.notification.create({
        data: {
          typeId: NotificationTypeEnum.MENTEE_SESSION_REJECTED,
          actorId: program.mentorId,
          notifierId: userId,
          message: `${program.mentorId} has rejected your session request`,
          additional: {
            programId: session.program.id,
            sessionId: sessionId,
          },
        },
      });
      this.socketService.sendNotification(userId, notification);
      return notification;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async messageReceived(roomId: number, sender: number) {
    const room = await this.prisma.chatRoom.findFirst({
      where: { id: roomId },
      select: {
        participants: {
          select: {
            id: true,
          },
        },
      },
    });
    const usersToSend = room.participants.filter((user) => user.id !== sender);
    const pro = usersToSend.map(async (user) => {
      const notification = await this.prisma.notification.create({
        data: {
          typeId: NotificationTypeEnum.NEW_MESSAGE,
          actorId: sender,
          notifierId: user.id,
          message: `${sender} has sent a message to ${roomId}`,
          additional: {
            roomId,
            sender,
          },
        },
      });
      this.socketService.sendNotification(user.id, notification);
    });
    await Promise.all(pro);
  }
}
