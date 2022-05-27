import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatSessionService } from './chat-session.service';
import { ChatService } from './chat.service';
import JwtAuthenticationGuard from '../auth/guards/jwt-authentiacation.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '@prisma/client';
import { ChatGuard } from '../guards/chat.guard';
import { ChatQueryDto } from './dto/chat-query.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
@ApiTags('Chat')
export class ChatController {
  constructor(
    private readonly chatSessionService: ChatSessionService,
    private readonly chatService: ChatService,
  ) {}

  @Get('session/:sessionId')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Get chat room information' })
  @ApiBearerAuth()
  getRoomIdBySession(
    @Param('sessionId') sessionId: string,
    @GetUser() user: User,
  ) {
    return this.chatSessionService.getChatRoomInfoBySessionId(
      +sessionId,
      user.id,
    );
  }

  @Get('room')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Get my rooms' })
  @ApiBearerAuth()
  getRooms(@GetUser() user: User) {
    return this.chatService.getMyRooms(user.id);
  }

  @Get('room/:roomId')
  @UseGuards(JwtAuthenticationGuard, ChatGuard)
  @ApiOperation({ summary: 'Get room info' })
  @ApiBearerAuth()
  getRoomInfo(@Param('roomId') roomId: string, @GetUser() user: User) {
    return this.chatService.getRoomInfo(+roomId);
  }

  @Get('room/:roomId/message')
  @UseGuards(JwtAuthenticationGuard, ChatGuard)
  @ApiOperation({ summary: 'Get messages' })
  @ApiBearerAuth()
  getMessages(
    @Param('roomId') roomId: string,
    @Query() query: ChatQueryDto,
    @GetUser() user: User,
  ) {
    return this.chatService.getMessages(
      +roomId,
      user.id,
      query.limit,
      query.skip,
    );
  }

  @Post('room/:roomId')
  @UseGuards(JwtAuthenticationGuard, ChatGuard)
  @ApiOperation({ summary: 'Send message' })
  @ApiBearerAuth()
  sendMessage(
    @Param('roomId') roomId: string,
    @GetUser() user: User,
    @Body() body: SendMessageDto,
  ) {
    return this.chatService.createMessage(+roomId, user.id, body.message);
  }
}
