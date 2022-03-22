import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { MentorController } from './mentor.controller';
import { MentorService } from './mentor.service';
import { DegreeModule } from './degree/degree.module';
import { ExperienceModule } from './experience/experience.module';
import { ProgramModule } from './program/program.module';

@Module({
  imports: [PrismaModule, AuthModule, DegreeModule, ExperienceModule, ProgramModule],
  controllers: [MentorController],
  providers: [MentorService],
})
export class MentorModule {}
