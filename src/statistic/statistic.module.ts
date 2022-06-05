import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { StatisticAdminService } from './statistic-admin.service';

@Module({
  imports: [PrismaModule],
  providers: [StatisticAdminService],
})
export class StatisticModule {}
