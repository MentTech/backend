import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatisticMentorService } from './statistic-mentor.service';
import JwtAuthenticationGuard from '../auth/guards/jwt-authentiacation.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role, User } from '@prisma/client';
import { GetUser } from '../decorators/get-user.decorator';
import { ProfitQueryDto } from './dto/profit-query.dto';

@Controller('statistic/mentor')
@UseGuards(JwtAuthenticationGuard, RolesGuard)
@Roles(Role.MENTOR)
@ApiTags('Statistic Mentor')
@ApiBearerAuth()
export class StatisticMentorController {
  constructor(
    private readonly statisticMentorService: StatisticMentorService,
  ) {}

  @Get('/mentees')
  @ApiOperation({ summary: 'Get number of mentees' })
  getNumberOfMentee(@GetUser() user: User) {
    return this.statisticMentorService.getNumberOfMentee(user.id);
  }

  @Get('/session-pie')
  @ApiOperation({ summary: 'Get session pie data' })
  sessionStatistic(@GetUser() user: User) {
    return this.statisticMentorService.sessionStatistic(user.id);
  }

  @Get('/session-done')
  @ApiOperation({ summary: 'Get number of accepted session in months' })
  getNumberOfDoneSession(
    @GetUser() user: User,
    @Query() query: ProfitQueryDto,
  ) {
    return this.statisticMentorService.getSessionStatistic(
      user.id,
      query.months,
    );
  }
}
