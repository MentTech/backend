import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { MentorController } from './mentor.controller';
import { MentorService } from './mentor.service';
import { DegreeModule } from './degree/degree.module';
import { ExperienceModule } from './experience/experience.module';
import { ProgramModule } from './program/program.module';
import { RatingModule } from '../rating/rating.module';
import { AchievementModule } from './achievement/achievement.module';
import { SessionStatisticService } from './session-statistic.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    DegreeModule,
    ExperienceModule,
    ProgramModule,
    RatingModule,
    AchievementModule,
  ],
  controllers: [MentorController],
  providers: [MentorService, SessionStatisticService],
})
export class MentorModule {}
