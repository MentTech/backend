import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatisticAdminService } from './statistic-admin.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../guards/roles.guard';
import JwtAuthenticationGuard from '../auth/guards/jwt-authentiacation.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ProfitQueryDto } from './dto/profit-query.dto';

@Controller('statistic/admin')
@UseGuards(JwtAuthenticationGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiTags('StatisticAdmin')
@ApiBearerAuth()
export class StatisticAdminController {
  constructor(private readonly statisticAdminService: StatisticAdminService) {}

  @Get('/common')
  @ApiOperation({
    summary: 'Get common statistic',
  })
  getCommonStatistic() {
    return this.statisticAdminService.commonStatistic();
  }

  @Get('/profit')
  @ApiOperation({
    summary: 'Get profit statistic',
  })
  getProfitStatistic(@Query() query: ProfitQueryDto) {
    return this.statisticAdminService.profitStatistic(query.months);
  }

  @Get('/session-total')
  @ApiOperation({
    summary: 'Get session total',
  })
  getSessionTotal() {
    return this.statisticAdminService.sessionStatistic();
  }

  @Get('/new-user')
  @ApiOperation({
    summary: 'Get new user statistic',
  })
  getNewUserStatistic(@Query() query: ProfitQueryDto) {
    return this.statisticAdminService.newUserStatistic(query.months);
  }
}
