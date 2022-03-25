import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { RegisterModule } from './register/register.module';

@Module({
  imports: [PrismaModule, RegisterModule],
  controllers: [ProgramController],
  providers: [ProgramService],
})
export class ProgramModule {}
