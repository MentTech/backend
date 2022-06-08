import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SessionStatisticMentorQueryDto } from './dtos/session-statistic-mentor-query.dto';
import { Prisma } from '@prisma/client';
import { SessionMentorQueryDto } from './dtos/session-mentor-query.dto';
import { PaginationResponseDto } from '../dtos/pagination-response.dto';
import { RegisterResponseDto } from './program/register/dto/register-response.dto';

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

  async getSessions(query: SessionMentorQueryDto, mentorId: number) {
    const { page, limit } = query;
    const where: Prisma.ProgramRegisterWhereInput = {
      program: {
        mentorId: mentorId,
      },
      isAccepted: query.isAccepted,
      done: query.isDone,
      isCanceled: query.isCanceled,
      createAt: {
        gte: query.from,
        lte: query.to,
      },
    };
    const count = await this.prisma.programRegister.count({ where });
    const offset = (page - 1) * limit;
    const totalPages = Math.ceil(count / limit);
    const sessions = await this.prisma.programRegister.findMany({
      where,
      include: {
        program: true,
        menteeInfo: true,
      },
      skip: offset,
      take: limit,
      orderBy: {
        createAt: query.orderDirection,
      },
    });
    return new PaginationResponseDto<RegisterResponseDto>({
      page,
      limit,
      totalPage: totalPages,
      data: sessions.map((session: any) => new RegisterResponseDto(session)),
    });
  }
}
