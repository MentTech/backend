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
        menteeInfo: true,
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
          message: `${session.menteeInfo.name} has requested a session for ${program.title}`,
          additional: {
            program: {
              id: program.id,
              title: program.title,
            },
            sessionId: sessionId,
            mentee: {
              name: session.menteeInfo.name,
            },
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
          message: `Your session request for ${program.title} has been accepted`,
          additional: {
            program: {
              id: program.id,
              title: program.title,
            },
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
          message: `Your session request for ${program.title} has been rejected`,
          additional: {
            program: {
              id: program.id,
              title: program.title,
            },
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
    const pro = usersToSend.map((user) =>
      this.receiveMessageNotification(roomId, sender, user.id),
    );
    await Promise.all(pro);
  }

  async receiveMessageNotification(
    roomId: number,
    sender: number,
    receiverId: number,
  ) {
    const pastNotifications = await this.prisma.notification.findFirst({
      where: {
        typeId: NotificationTypeEnum.NEW_MESSAGE,
        actorId: sender,
        notifierId: receiverId,
        isRead: false,
        createAt: {
          gte: new Date().toISOString().split('T')[0],
        },
      },
    });
    if (pastNotifications) {
      return;
    }
    const notification = await this.prisma.notification.create({
      data: {
        typeId: NotificationTypeEnum.NEW_MESSAGE,
        actorId: sender,
        notifierId: receiverId,
        message: `You have a new message in room ${roomId}`,
        additional: {
          roomId,
          sender,
        },
      },
    });
    this.socketService.sendNotification(receiverId, notification);
  }
}
