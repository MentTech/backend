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
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('/')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.MENTEE)
  @ApiOperation({ summary: 'Mentee request a session' })
  @ApiBearerAuth()
  requestSession(@GetUser() user: User, @Param('programId') programId: string) {
    return this.registerService.requestSession(user.id, +programId);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.MENTEE)
  @ApiOperation({ summary: 'Mentee remove an unaccepted session' })
  @ApiBearerAuth()
  menteeRemoveSession(@GetUser() user: User, @Param('id') sessionId: string) {
    return this.registerService.menteeRemoveSession(+sessionId, user.id);
  }

  @Post('/:id')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, MentorGuard)
  @Roles(Role.MENTOR)
  @ApiOperation({ summary: 'Mentor accept an unaccepted session' })
  @ApiBearerAuth()
  @ApiParam({ name: 'mentorId', required: true })
  mentorAcceptSession(
    @Param('id') sessionId: string,
    @Body() acceptSessionDto: AcceptSessionDto,
  ) {
    return this.registerService.acceptSession(+sessionId, acceptSessionDto);
  }

  @Post('/:id/reject')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.MENTOR)
  @ApiOperation({ summary: 'Mentor reject an unaccepted session' })
  @ApiBearerAuth()
  @ApiParam({ name: 'mentorId', required: true })
  mentorRejectSession(
    @Param('id') sessionId: string,
    @Param('mentorId') mentorId: string,
  ) {
    return this.registerService.rejectSession(+sessionId, +mentorId);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, MentorGuard)
  @Roles(Role.MENTOR)
  @ApiOperation({ summary: 'Mentor update an accepted session' })
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  getAllSession(@GetUser() user: User, @Param('programId') programId: string) {
    if (user.role === Role.MENTEE) {
      return this.registerService.menteeFindAll(user.id, +programId);
    } else if (user.role === Role.MENTOR) {
      return this.registerService.mentorFindAll(user.id, +programId);
    }
  }
}
