import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SendNotificationService } from './send-notification.service';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [PrismaModule, SocketModule],
  controllers: [NotificationController],
  providers: [NotificationService, SendNotificationService],
  exports: [SendNotificationService],
})
export class NotificationModule {}
