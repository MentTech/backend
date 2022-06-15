import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  GiftCode,
  Prisma,
  TransactionStatus,
  TransactionType,
} from '@prisma/client';
import { nanoid } from 'nanoid';
import { CreateGiftCardDto } from '../dto/create-giftcard.dto';
import { BalanceResponseDto } from '../dto/balance-response.dto';
import { CreateRegisterMenteeInfoDto } from '../../mentor/program/register/dto/create-register-mentee-info.dto';
import { TransactionQueryDto } from '../dto/transaction-query.dto';
import { PaginationResponseDto } from '../../dtos/pagination-response.dto';

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
          coin: balance._sum.amount || 0,
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

  async menteeRequestSession(
    menteeId: number,
    programId: number,
    dto: CreateRegisterMenteeInfoDto,
  ) {
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
    const [menteeTransaction, mentorTransaction, sessionRegister] =
      await this.prisma.$transaction([
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
            relatedId: uniqueId,
            menteeInfo: {
              create: dto,
            },
          },
        }),
      ]);
    await this.calculateBalance(menteeId);
    return sessionRegister;
  }

  async findSessions(sessionId: number) {
    const session = await this.prisma.programRegister.findFirst({
      where: {
        id: sessionId,
      },
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    const transactions = await this.prisma.userTransaction.findMany({
      where: {
        relatedId: session.relatedId,
      },
    });
    if (transactions.length !== 2) {
      throw new NotFoundException('Transaction not found');
    }
    let menteeTransaction: number;
    let mentorTransaction: number;
    transactions.forEach((t) => {
      if (t.userId === session.userId) {
        if (t.status !== TransactionStatus.HOLD) {
          throw new UnprocessableEntityException('Transaction not hold');
        }
        menteeTransaction = t.id;
      } else {
        if (t.status !== TransactionStatus.PENDING) {
          throw new UnprocessableEntityException('Transaction not pending');
        }
        mentorTransaction = t.id;
      }
    });
    return {
      mentor: mentorTransaction,
      mentee: menteeTransaction,
    };
  }

  async completeSession(sessionId: number) {
    const transactions = await this.findSessions(sessionId);
    const { mentor, mentee } = transactions;
    await this.prisma.$transaction([
      this.prisma.userTransaction.update({
        where: {
          id: mentee,
        },
        data: {
          status: TransactionStatus.SUCCESS,
        },
      }),
      this.prisma.userTransaction.update({
        where: {
          id: mentor,
        },
        data: {
          status: TransactionStatus.SUCCESS,
        },
      }),
      this.prisma.programRegister.update({
        where: {
          id: sessionId,
        },
        data: {
          isAccepted: true,
          done: true,
          doneAt: new Date(),
        },
      }),
    ]);
  }

  async mentorRefuseSession(sessionId: number) {
    const transactions = await this.findSessions(sessionId);
    const { mentor, mentee } = transactions;
    const [menteeTransaction, mentorTransaction, sessionRegister] =
      await this.prisma.$transaction([
        this.prisma.userTransaction.update({
          where: {
            id: mentee,
          },
          data: {
            status: TransactionStatus.FAILED,
          },
        }),
        this.prisma.userTransaction.update({
          where: {
            id: mentor,
          },
          data: {
            status: TransactionStatus.FAILED,
          },
        }),
        this.prisma.programRegister.update({
          where: {
            id: sessionId,
          },
          data: {
            isAccepted: false,
            done: true,
            isCanceled: true,
          },
        }),
      ]);
    return sessionRegister;
  }

  async withdraw(userId: number, coin: number) {
    await this.prisma.userTransaction.create({
      data: {
        userId,
        amount: -coin,
        type: TransactionType.WITHDRAW,
        status: TransactionStatus.SUCCESS,
        message: 'Withdraw',
      },
    });
    await this.calculateBalance(userId);
  }

  createGiftCard(dto: CreateGiftCardDto): Promise<GiftCode> {
    return this.prisma.giftCode.create({
      data: {
        ...dto,
        code: nanoid(),
        valid: true,
      },
    });
  }

  getAllGiftCard(): Promise<GiftCode[]> {
    return this.prisma.giftCode.findMany();
  }

  async applyGiftCard(userId: number, code: string) {
    const card = await this.prisma.giftCode.findFirst({
      where: {
        code,
        valid: true,
        validFrom: { lte: new Date() },
        validTo: { gte: new Date() },
        usageLeft: { gt: 0 },
      },
    });
    if (!card) {
      throw new NotFoundException('Gift card not found');
    }
    await this.prisma.$transaction([
      this.prisma.giftCode.update({
        where: {
          code,
        },
        data: {
          usageLeft: card.usageLeft - 1,
        },
      }),
      this.prisma.userTransaction.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          amount: card.coin,
          type: TransactionType.TOPUP,
          status: TransactionStatus.SUCCESS,
          message: 'Gift card',
        },
      }),
    ]);
    await this.calculateBalance(userId);
  }

  async topUpByAdmin(userId: number, coin: number) {
    const transaction = await this.prisma.userTransaction.create({
      data: {
        userId,
        amount: coin,
        type: TransactionType.TOPUP,
        status: TransactionStatus.SUCCESS,
        message: 'Top up',
      },
    });
    await this.calculateBalance(userId);
    return transaction;
  }

  async getTransactions(userId: number) {
    const transactions = await this.prisma.userTransaction.findMany({
      where: {
        userId,
      },
    });
    const balance = await this.calculateBalance(userId);
    return new BalanceResponseDto({
      transactions,
      balance,
    });
  }

  async queryTransactions(query: TransactionQueryDto) {
    const { page, limit } = query;
    const where: Prisma.UserTransactionWhereInput = {
      type: query.type,
      status: query.status,
    };
    const count = await this.prisma.userTransaction.count({ where });
    const totalPage = Math.ceil(count / limit);
    const transactions = await this.prisma.userTransaction.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createAt: query.orderByDirection,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
    return new PaginationResponseDto({
      page,
      totalPage,
      limit,
      data: transactions,
    });
  }
}
