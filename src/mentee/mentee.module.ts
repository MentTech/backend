import { Module } from '@nestjs/common';
import { MenteeService } from './mentee.service';
import { MenteeController } from './mentee.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [MenteeController],
  providers: [MenteeService],
})
export class MenteeModule {}
