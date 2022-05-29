import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  getNotification(userId: number, limit: number, skip: number) {
    return this.prisma.notification.findMany({
      where: {
        notifierId: userId,
      },
      include: {
        type: true,
      },
      take: limit,
      skip,
      orderBy: {
        createAt: 'desc',
      },
    });
  }

  async setNotificationRead(notificationId: number, userId: number) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
      },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    if (notification.notifierId !== userId) {
      throw new ForbiddenException('Not authorized');
    }
    if (notification.isRead) {
      return notification;
    }
    return this.prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
      include: {
        type: true,
      },
    });
  }

  async setMultipleNotificationRead(notificationIds: number[], userId: number) {
    if (notificationIds.length === 0) {
      throw new BadRequestException('No notification id provided');
    }
    const notifications = await this.prisma.notification.findMany({
      where: {
        id: {
          in: notificationIds,
        },
        notifierId: userId,
      },
    });
    if (notifications.length !== notificationIds.length) {
      throw new ForbiddenException('Not authorized');
    }
    const unreadNotifications = notifications.filter(
      (notification) => !notification.isRead,
    );
    if (unreadNotifications.length === 0) {
      return notifications;
    }
    return this.prisma.notification.updateMany({
      where: {
        id: {
          in: unreadNotifications.map((notification) => notification.id),
        },
      },
      data: {
        isRead: true,
      },
    });
  }
}
