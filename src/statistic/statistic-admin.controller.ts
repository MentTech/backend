import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticAdminService } from './statistic-admin.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../guards/roles.guard';
import JwtAuthenticationGuard from '../auth/guards/jwt-authentiacation.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('statistic/admin')
@ApiTags('StatisticAdmin')
export class StatisticAdminController {
  constructor(private readonly statisticAdminService: StatisticAdminService) {}

  @Get('/common')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Get common statistic',
  })
  @ApiBearerAuth()
  getCommonStatistic() {
    return this.statisticAdminService.commonStatistic();
  }
}
