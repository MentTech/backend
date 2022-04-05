import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionStatus, TransactionType } from '@prisma/client';
import { nanoid } from 'nanoid';

@Injectable()
export class TransactionCoinService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateBalance(userId: number): Promise<number> {
    try {
      const balance = await this.prisma.userTransaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          userId,
          status: {
            in: [TransactionStatus.HOLD, TransactionStatus.SUCCESS],
          },
        },
      });
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          coin: balance._sum.amount,
        },
      });
      return balance._sum.amount;
    } catch (error) {
      console.log(error);
      return -1;
    }
  }

  async checkBalance(userId: number, amount: number): Promise<boolean> {
    const balance = await this.calculateBalance(userId);
    if (balance < 0) {
      throw new InternalServerErrorException('Can not get balance');
    }
    return balance >= amount;
  }

  async menteeRequestSession(menteeId: number, programId: number) {
    const program = await this.prisma.program.findFirst({
      where: {
        id: programId,
      },
    });
    if (!program) {
      throw new NotFoundException('Program not found');
    }
    if (!(await this.checkBalance(menteeId, program.credit))) {
      throw new UnprocessableEntityException('Not enough coin');
    }
    const uniqueId = nanoid();
    this.prisma.$transaction([
      this.prisma.userTransaction.create({
        data: {
          relatedId: uniqueId,
          userId: menteeId,
          amount: -program.credit,
          type: TransactionType.APPLY,
          status: TransactionStatus.HOLD,
          message: 'Apply for session',
        },
      }),
      this.prisma.userTransaction.create({
        data: {
          relatedId: uniqueId,
          userId: program.mentorId,
          amount: program.credit,
          type: TransactionType.RECEIVE,
          status: TransactionStatus.PENDING,
          message: `${menteeId} apply for session`,
        },
      }),
      this.prisma.programRegister.create({
        data: {
          user: { connect: { id: menteeId } },
          program: { connect: { id: programId } },
        },
      }),
    ]);
    await this.calculateBalance(menteeId);
  }
}
