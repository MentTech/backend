import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderType, Role, TransactionStatus } from '@prisma/client';
import * as moment from 'moment';

@Injectable()
export class StatisticAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async commonStatistic() {
    const numberOfMentee = await this.prisma.user.count({
      where: {
        role: Role.MENTEE,
      },
    });
    const numberOfMentor = await this.prisma.user.count({
      where: {
        role: Role.MENTOR,
      },
    });
    const numberOfSession = await this.prisma.programRegister.count({
      where: {
        isAccepted: true,
        done: true,
      },
    });
    const date30DaysAgo = new Date();
    date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);
    const profit = await this.calculateProfit(date30DaysAgo, new Date());
    return {
      mentee: numberOfMentee,
      mentor: numberOfMentor,
      register: numberOfSession,
      profit,
    };
  }

  async calculateProfit(startDate: Date, endDate: Date) {
    const amountDeposited = await this.prisma.orderTransaction.aggregate({
      _sum: {
        total: true,
      },
      where: {
        orderType: OrderType.TopUp,
        status: TransactionStatus.SUCCESS,
        createAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    const amountWithdrawn = await this.prisma.orderTransaction.aggregate({
      _sum: {
        total: true,
      },
      where: {
        orderType: OrderType.Withdraw,
        status: TransactionStatus.SUCCESS,
        createAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    return amountDeposited._sum.total - amountWithdrawn._sum.total;
  }

  async profitStatistic(numberOfMonths: number) {
    const profit = [];
    for (let i = 0; i < numberOfMonths; i++) {
      const startDate = moment()
        .subtract(i, 'months')
        .startOf('month')
        .toDate();
      const endDate = moment().subtract(i, 'months').endOf('month').toDate();
      const profitMonth = await this.calculateProfit(startDate, endDate);
      profit.push({
        month: moment(startDate).format('MMM YYYY'),
        profit: profitMonth,
      });
    }
    return profit;
  }

  async sessionStatistic() {
    const numberOfDoneSession = await this.prisma.programRegister.count({
      where: {
        isAccepted: true,
        done: true,
      },
    });
    const numberOfInProgressSession = await this.prisma.programRegister.count({
      where: {
        isAccepted: true,
        done: false,
      },
    });
    const numberOfPendingSession = await this.prisma.programRegister.count({
      where: {
        isAccepted: false,
      },
    });
    const numberOfCanceledSession = await this.prisma.programRegister.count({
      where: {
        isAccepted: false,
        done: true,
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

  calculateNewUser(startDate: Date, endDate: Date, role: Role) {
    return this.prisma.user.count({
      where: {
        role,
        createAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async newUserStatistic(numberOfMonths: number) {
    const newMentee = [];
    const newMentor = [];
    for (let i = 0; i < numberOfMonths; i++) {
      const startDate = moment()
        .subtract(i, 'months')
        .startOf('month')
        .toDate();
      const endDate = moment().subtract(i, 'months').endOf('month').toDate();
      const newMenteeMonth = await this.calculateNewUser(
        startDate,
        endDate,
        Role.MENTEE,
      );
      const newMentorMonth = await this.calculateNewUser(
        startDate,
        endDate,
        Role.MENTOR,
      );
      newMentee.push({
        month: moment(startDate).format('MMM YYYY'),
        newUser: newMenteeMonth,
      });
      newMentor.push({
        month: moment(startDate).format('MMM YYYY'),
        newUser: newMentorMonth,
      });
    }
    return {
      mentee: newMentee,
      mentor: newMentor,
    };
  }

  calculateDoneSession(startDate: Date, endDate: Date) {
    return this.prisma.programRegister.count({
      where: {
        isAccepted: true,
        done: true,
        createAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async doneSessionStatistic(numberOfMonths: number) {
    const doneSession = [];
    for (let i = 0; i < numberOfMonths; i++) {
      const startDate = moment()
        .subtract(i, 'months')
        .startOf('month')
        .toDate();
      const endDate = moment().subtract(i, 'months').endOf('month').toDate();
      const doneSessionMonth = await this.calculateDoneSession(
        startDate,
        endDate,
      );
      doneSession.push({
        month: moment(startDate).format('MMM YYYY'),
        doneSession: doneSessionMonth,
      });
    }
    return doneSession;
  }
}
