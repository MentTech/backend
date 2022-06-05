import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderType, Role, TransactionStatus } from '@prisma/client';

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
    const amountDeposited = await this.prisma.orderTransaction.aggregate({
      _sum: {
        total: true,
      },
      where: {
        orderType: OrderType.TopUp,
        status: TransactionStatus.SUCCESS,
        createAt: {
          gte: date30DaysAgo,
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
          gte: date30DaysAgo,
        },
      },
    });
    const profit = amountDeposited._sum.total - amountWithdrawn._sum.total;
    return {
      mentee: numberOfMentee,
      mentor: numberOfMentor,
      register: numberOfSession,
      profit,
    };
  }
}
