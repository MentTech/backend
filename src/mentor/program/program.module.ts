import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { RegisterModule } from './register/register.module';
import { RatingModule } from '../../rating/rating.module';

@Module({
  imports: [PrismaModule, RegisterModule, RatingModule],
  controllers: [ProgramController],
  providers: [ProgramService],
})
export class ProgramModule {}
