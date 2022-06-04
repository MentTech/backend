import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTopUpOrderDto } from './dto/create-top-up-order.dto';
import { nanoid } from 'nanoid';
import {
  OrderType,
  Prisma,
  TransactionStatus,
  TransactionType,
} from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { GetOrdersQueryDto } from './dto/get-orders-query.dto';
import { PaginationResponseDto } from '../../dtos/pagination-response.dto';
import { TransactionCoinService } from '../transaction-coin/transaction-coin.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly transactionCoinService: TransactionCoinService,
  ) {}

  createTopUpOrder(userId: number, dto: CreateTopUpOrderDto) {
    const orderId = nanoid();

    const rate = this.configService.get<number>('transaction.topUpRate');

    const total = dto.token * rate;

    return this.prisma.orderTransaction.create({
      data: {
        ...dto,
        user: {
          connect: {
            id: userId,
          },
        },
        orderType: OrderType.TopUp,
        orderId,
        total,
        status: TransactionStatus.PENDING,
      },
    });
  }

  async getOrder(where: Prisma.OrderTransactionWhereInput = {}) {
    const order = await this.prisma.orderTransaction.findFirst({
      where: {
        ...where,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async getOrdersPagination(
    query: GetOrdersQueryDto,
    where: Prisma.OrderTransactionWhereInput = {},
  ) {
    const { page, limit, orderBy, orderByDirection } = query;
    const count = await this.prisma.orderTransaction.count();
    const totalPage = Math.ceil(count / limit);
    const filteredOrder = await this.prisma.orderTransaction.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        [orderBy]: orderByDirection,
      },
    });
    return new PaginationResponseDto({
      page,
      totalPage,
      limit,
      data: filteredOrder,
    });
  }

  async processTopUpOrder(orderId: string, isAccept: boolean) {
    const order = await this.prisma.orderTransaction.findFirst({
      where: {
        orderId,
        orderType: OrderType.TopUp,
        status: TransactionStatus.PENDING,
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!order) {
      throw new NotFoundException('Order not found or already processed');
    }
    if (!isAccept) {
      return this.prisma.orderTransaction.update({
        where: {
          id: order.id,
        },
        data: {
          status: TransactionStatus.FAILED,
        },
      });
    }
    const [updatedOrder, transaction] = await this.prisma.$transaction([
      this.prisma.orderTransaction.update({
        where: {
          id: order.id,
        },
        data: {
          status: TransactionStatus.SUCCESS,
        },
      }),
      this.prisma.userTransaction.create({
        data: {
          user: {
            connect: {
              id: order.user.id,
            },
          },
          amount: order.token,
          type: TransactionType.TOPUP,
          status: TransactionStatus.SUCCESS,
          message: `Top up with order #${order.orderId}`,
          relatedId: order.orderId,
        },
      }),
    ]);
    await this.transactionCoinService.calculateBalance(transaction.userId);
    return updatedOrder;
  }

  getTopUpRate() {
    const rate = this.configService.get<number>('transaction.topUpRate');
    return {
      topUpRate: rate,
    };
  }
}
