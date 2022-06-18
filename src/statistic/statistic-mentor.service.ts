import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as moment from 'moment';

@Injectable()
export class StatisticMentorService {
  constructor(private readonly prisma: PrismaService) {}

  async getNumberOfMentee(mentorId: number) {
    const ret = await this.prisma
      .$queryRaw`SELECT count(distinct pr."userId") as "mentee"
                    from "ProgramRegister" pr 
                    join "Program" p
                    on pr."programId" = p.id 
                    join "UserMentor" um 
                    on p."mentorId" = um."userId" 
                    where um."userId" = ${mentorId} and pr."isAccepted" = true`;
    return {
      mentee: ret[0]?.mentee || 0,
    };
  }

  async sessionStatistic(mentorId: number) {
    const numberOfDoneSession = await this.prisma.programRegister.count({
      where: {
        isAccepted: true,
        done: true,
        program: {
          mentorId,
        },
      },
    });
    const numberOfInProgressSession = await this.prisma.programRegister.count({
      where: {
        isAccepted: true,
        done: false,
        program: {
          mentorId,
        },
      },
    });
    const numberOfPendingSession = await this.prisma.programRegister.count({
      where: {
        isAccepted: false,
        program: {
          mentorId,
        },
      },
    });
    const numberOfCanceledSession = await this.prisma.programRegister.count({
      where: {
        isAccepted: false,
        done: true,
        program: {
          mentorId,
        },
      },
    });
    return [
      {
        name: 'Pending',
        value: numberOfPendingSession,
      },
      {
        name: 'In progress',
        value: numberOfInProgressSession,
      },
      {
        name: 'Done',
        value: numberOfDoneSession,
      },
      {
        name: 'Canceled',
        value: numberOfCanceledSession,
      },
    ];
  }

  getNumberOfSession(mentorId: number, startDate: Date, endDate: Date) {
    return this.prisma.programRegister.count({
      where: {
        program: {
          mentorId,
        },
        isAccepted: true,
        createAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async getSessionStatistic(mentorId: number, months: number) {
    const sessions = [];
    for (let i = 0; i < months; i++) {
      const startDate = moment()
        .subtract(i, 'months')
        .startOf('month')
        .toDate();
      const endDate = moment().subtract(i, 'months').endOf('month').toDate();
      const acceptedSessionMonth = await this.getNumberOfSession(
        mentorId,
        startDate,
        endDate,
      );
      sessions.push({
        month: moment(startDate).format('MMM YYYY'),
        acceptedSession: acceptedSessionMonth,
      });
    }
    return sessions;
  }
}
