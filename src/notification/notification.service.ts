import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  getNotification(userId: number) {
    return this.prisma.notification.findMany({
      where: {
        notifierId: userId,
      },
      include: {
        type: true,
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
}
