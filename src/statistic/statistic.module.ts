import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { StatisticAdminService } from './statistic-admin.service';
import { StatisticAdminController } from './statistic-admin.controller';

@Module({
  imports: [PrismaModule],
  controllers: [StatisticAdminController],
  providers: [StatisticAdminService],
})
export class StatisticModule {}
