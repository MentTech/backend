import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SessionStatisticMentorQueryDto } from './dtos/session-statistic-mentor-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SessionStatisticService {
  constructor(private readonly prisma: PrismaService) {}

  getSessionCount(
    query: SessionStatisticMentorQueryDto,
    mentorId: number,
  ): Promise<number> {
    const where: Prisma.ProgramRegisterWhereInput = {
      program: {
        mentorId: mentorId,
      },
      isAccepted: query.isAccepted,
      done: query.isDone,
      createAt: {
        gte: query.from,
        lte: query.to,
      },
    };
    return this.prisma.programRegister.count({ where });
  }
}
