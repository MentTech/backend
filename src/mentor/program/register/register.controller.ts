import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RegisterService } from './register.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import JwtAuthenticationGuard from '../../../auth/guards/jwt-authentiacation.guard';
import { Roles } from '../../../decorators/roles.decorator';
import { Role, User } from '@prisma/client';
import { RolesGuard } from '../../../guards/roles.guard';
import { GetUser } from '../../../decorators/get-user.decorator';
import { AcceptSessionDto } from './dto/accept-session.dto';
import { MentorGuard } from '../../../guards/mentor.guard';

@Controller('mentor/:mentorId/program/:programId/register')
@ApiTags('Program register')
@ApiBearerAuth()
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('/')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.MENTEE)
  @ApiOperation({ summary: 'Mentee request a session' })
  requestSession(@GetUser() user: User, @Param('programId') programId: string) {
    return this.registerService.requestSession(user.id, +programId);
  }

  @Delete('/:sessionId')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.MENTEE)
  @ApiOperation({ summary: 'Mentee remove an unaccepted session' })
  menteeRemoveSession(
    @GetUser() user: User,
    @Param('sessionId') sessionId: string,
  ) {
    return this.registerService.menteeRemoveSession(+sessionId, user.id);
  }

  @Patch('/:sessionId/done')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.MENTEE)
  @ApiOperation({ summary: 'Mentee mark a session as done' })
  menteeMarkSessionAsDone(
    @GetUser() user: User,
    @Param('sessionId') sessionId: string,
  ) {
    return this.registerService.menteeCloseSession(+sessionId, user.id);
  }

  @Post('/:sessionId')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, MentorGuard)
  @Roles(Role.MENTOR)
  @ApiOperation({ summary: 'Mentor accept an unaccepted session' })
  @ApiParam({ name: 'mentorId', required: true })
  mentorAcceptSession(
    @Param('sessionId') sessionId: string,
    @Body() acceptSessionDto: AcceptSessionDto,
  ) {
    return this.registerService.acceptSession(+sessionId, acceptSessionDto);
  }

  @Post('/:sessionId/reject')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.MENTOR)
  @ApiOperation({ summary: 'Mentor reject an unaccepted session' })
  @ApiParam({ name: 'mentorId', required: true })
  mentorRejectSession(
    @Param('sessionId') sessionId: string,
    @Param('mentorId') mentorId: string,
  ) {
    return this.registerService.rejectSession(+sessionId, +mentorId);
  }

  @Patch('/:sessionId')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, MentorGuard)
  @Roles(Role.MENTOR)
  @ApiOperation({ summary: 'Mentor update an accepted session' })
  @ApiParam({ name: 'mentorId', required: true })
  mentorUpdateSession(
    @Param('id') sessionId: string,
    @Param('mentorId') mentorId: string,
    @Body() acceptSessionDto: AcceptSessionDto,
  ) {
    return this.registerService.mentorUpdateSession(
      +sessionId,
      +mentorId,
      acceptSessionDto,
    );
  }

  @Get('/')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.MENTOR, Role.MENTEE)
  @ApiOperation({ summary: 'Get all session' })
  getAllSession(@GetUser() user: User, @Param('programId') programId: string) {
    if (user.role === Role.MENTEE) {
      return this.registerService.menteeFindAll(user.id, +programId);
    } else if (user.role === Role.MENTOR) {
      return this.registerService.mentorFindAll(user.id, +programId);
    }
  }
}
