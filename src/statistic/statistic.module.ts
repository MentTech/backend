import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { StatisticAdminService } from './statistic-admin.service';
import { StatisticAdminController } from './statistic-admin.controller';
import { StatisticMentorService } from './statistic-mentor.service';
import { StatisticMentorController } from './statistic-mentor.controller';

@Module({
  imports: [PrismaModule],
  controllers: [StatisticAdminController, StatisticMentorController],
  providers: [StatisticAdminService, StatisticMentorService],
})
export class StatisticModule {}
