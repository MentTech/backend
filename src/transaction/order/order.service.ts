import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTopUpOrderDto } from './dto/create-top-up-order.dto';
import { nanoid } from 'nanoid';
import {
  OrderType,
  PaymentMethod,
  Prisma,
  TransactionStatus,
  TransactionType,
} from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { GetOrdersQueryDto } from './dto/get-orders-query.dto';
import { PaginationResponseDto } from '../../dtos/pagination-response.dto';
import { TransactionCoinService } from '../transaction-coin/transaction-coin.service';
import { CreateWithdrawOrderDto } from './dto/create-withdraw-order.dto';
import { payment, Payment, PaymentResponse } from 'paypal-rest-sdk';
import { PaypalService } from '../../paypal/paypal.service';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import * as moment from 'moment';
import ExecuteRequest = payment.ExecuteRequest;

@Injectable()
export class OrderService {
  private readonly logger = new Logger('OrderService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly transactionCoinService: TransactionCoinService,
    private readonly paypalService: PaypalService,
    private readonly schedulerRegistry: SchedulerRegistry,
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

  createWithdrawOrder(userId: number, dto: CreateWithdrawOrderDto) {
    const orderId = nanoid();
    const rate = this.configService.get<number>('transaction.withdrawRate');
    const total = dto.token * rate;
    return this.prisma.orderTransaction.create({
      data: {
        ...dto,
        token: -dto.token,
        user: {
          connect: {
            id: userId,
          },
        },
        orderType: OrderType.Withdraw,
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

  async processWithdrawOrder(orderId: string, isAccept: boolean) {
    const order = await this.prisma.orderTransaction.findFirst({
      where: {
        orderId,
        orderType: OrderType.Withdraw,
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
          message: `Withdraw with order #${order.orderId}`,
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

  getWithdrawRate() {
    const rate = this.configService.get<number>('transaction.withdrawRate');
    return {
      withdrawRate: rate,
    };
  }

  async createPaypalOrder(
    userId: number,
    dto: CreateTopUpOrderDto,
    origin?: string,
  ) {
    if (dto.paymentMethod !== PaymentMethod.Paypal) {
      throw new BadRequestException('Invalid payment method');
    }

    const rate =
      this.configService.get<number>('transaction.topUpRate') *
      this.configService.get<number>('transaction.vndUsdRate');
    const price = dto.token * rate;
    const vndPrice =
      dto.token * this.configService.get<number>('transaction.topUpRate');

    const webUrl = origin || this.configService.get<string>('url.web');

    const create_payment_json: Payment = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: `${webUrl}/order/paypal/success`,
        cancel_url: `${webUrl}/order/paypal/cancel`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: `${dto.token} token`,
                sku: '001',
                price: price.toString(),
                currency: 'USD',
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: 'USD',
            total: price.toString(),
          },
          description: 'Top up token',
        },
      ],
    };
    const payment = await this.createPaypalPayment(create_payment_json);
    const order = await this.prisma.orderTransaction.create({
      data: {
        ...dto,
        user: {
          connect: {
            id: userId,
          },
        },
        orderType: OrderType.TopUp,
        orderId: payment.id,
        total: vndPrice,
        status: TransactionStatus.PENDING,
      },
    });
    this.createPaypalTimeout(order.orderId);
    return {
      order,
      approveUrl: payment.url,
    };
  }

  createPaypalTimeout(orderId: string) {
    const callback = async () => {
      this.logger.verbose(`Paypal timeout for order ${orderId}`);
      const order = await this.prisma.orderTransaction.findFirst({
        where: {
          orderId,
          orderType: OrderType.TopUp,
          status: TransactionStatus.PENDING,
        },
      });
      if (!order) {
        return;
      }
      const updatedOrder = await this.prisma.orderTransaction.update({
        where: {
          orderId,
        },
        data: {
          status: TransactionStatus.FAILED,
        },
      });
      this.logger.verbose(`Order ${updatedOrder.orderId} closed`);
    };
    const timeOut = setTimeout(callback, 3 * 60 * 60 * 1000);
    this.schedulerRegistry.addTimeout(orderId, timeOut);
  }

  deleteTimeout(name: string) {
    const timeOut = this.schedulerRegistry.getTimeout(name);
    clearTimeout(timeOut);
    this.schedulerRegistry.deleteTimeout(name);
  }

  createPaypalPayment(payment: Payment) {
    return new Promise<{ url: string; id: string }>((resolve, reject) => {
      const paypal = this.paypalService.getPaypal();
      paypal.payment.create(payment, (error, payment) => {
        if (error) {
          reject(error);
        }
        const url = payment.links.find(
          (link) => link.rel === 'approval_url',
        ).href;
        resolve({ url, id: payment.id });
      });
    });
  }

  async approvePaypalOrder(paymentId: string, payerId: string) {
    const order = await this.prisma.orderTransaction.findFirst({
      where: {
        orderId: paymentId,
        orderType: OrderType.TopUp,
      },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.status === TransactionStatus.SUCCESS) {
      throw new ForbiddenException('Order already processed');
    }
    if (order.status === TransactionStatus.FAILED) {
      throw new ForbiddenException('Order already failed');
    }
    try {
      const payment = await this.executePaypalOrder(paymentId, payerId);
      if (payment.state !== 'approved') {
        throw new BadRequestException('Payment not approved');
      }
      this.logger.verbose(`Payment ${paymentId} approved`);
      this.deleteTimeout(order.orderId);
      return await this.processTopUpOrder(paymentId, true);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  executePaypalOrder(paymentId: string, payerId: string) {
    return new Promise<PaymentResponse>((resolve, reject) => {
      const paypal = this.paypalService.getPaypal();
      const execute_payment_json: ExecuteRequest = {
        payer_id: payerId,
      };
      paypal.payment.execute(
        paymentId,
        execute_payment_json,
        (error, payment) => {
          if (error) {
            reject(error);
          }
          resolve(payment);
        },
      );
    });
  }

  @Cron('0 0 0 * * *')
  async closeExpiredOrder() {
    this.logger.log('Close expired order');
    const expiredTime = moment().subtract(3, 'days').toDate();
    const orders = await this.prisma.orderTransaction.findMany({
      where: {
        orderType: OrderType.TopUp,
        status: TransactionStatus.PENDING,
        createAt: {
          lt: expiredTime,
        },
      },
    });
    for (const order of orders) {
      const updatedOrder = await this.prisma.orderTransaction.update({
        where: {
          id: order.id,
        },
        data: {
          status: TransactionStatus.FAILED,
        },
      });
      this.logger.log(`Close expired order ${updatedOrder.orderId}`);
    }
  }

  @Cron('0 0 0 * * *')
  async checkPaypalOrder() {
    this.logger.log('Close expired paypal order');
    const expiredTime = moment().subtract(3, 'hours').toDate();
    const orders = await this.prisma.orderTransaction.findMany({
      where: {
        orderType: OrderType.TopUp,
        status: TransactionStatus.PENDING,
        paymentMethod: PaymentMethod.Paypal,
        createAt: {
          lt: expiredTime,
        },
      },
    });
    for (const order of orders) {
      this.logger.log(`Close expired paypal order ${order.orderId}`);
      await this.prisma.orderTransaction.update({
        where: {
          id: order.id,
        },
        data: {
          status: TransactionStatus.FAILED,
        },
      });
    }
  }
}
