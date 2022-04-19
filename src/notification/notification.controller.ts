import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from '../auth/guards/jwt-authentiacation.guard';
import { GetUser } from '../decorators/get-user.decorator';

@Controller('notification')
@ApiTags('Notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiBearerAuth()
  async getNotification(@GetUser() user) {
    return this.notificationService.getNotification(user.id);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiBearerAuth()
  async markAsRead(@GetUser() user, @Param('id') id: string) {
    return this.notificationService.setNotificationRead(+id, user.id);
  }
}
