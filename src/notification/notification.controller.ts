import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from '../auth/guards/jwt-authentiacation.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { MarkMultipleNotificationDto } from './dto/mark-multiple-notification.dto';
import { ChatQueryDto } from '../chat/dto/chat-query.dto';

@Controller('notification')
@ApiTags('Notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiBearerAuth()
  async getNotification(@GetUser() user, @Query() query: ChatQueryDto) {
    return this.notificationService.getNotification(
      user.id,
      query.limit,
      query.skip,
    );
  }

  @Patch('/multiple')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Mark multiple notifications as read' })
  @ApiBearerAuth()
  markMultipleAsRead(
    @GetUser() user,
    @Body() body: MarkMultipleNotificationDto,
  ) {
    return this.notificationService.setMultipleNotificationRead(
      body.ids,
      user.id,
    );
  }

  @Patch('/:id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiBearerAuth()
  markAsRead(@GetUser() user, @Param('id') id: string) {
    return this.notificationService.setNotificationRead(+id, user.id);
  }
}
