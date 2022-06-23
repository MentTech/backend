import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionCoinService } from '../transaction-coin/transaction-coin.service';
import { PaypalService } from '../../paypal/paypal.service';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';

const mockPrismaService = {};
const mockTransactionCoinService = {};
const mockConfigService = {};
const mockPaypalService = {};
const mockSchedulerRegistry = {};

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: TransactionCoinService,
          useValue: mockTransactionCoinService,
        },
        {
          provide: PaypalService,
          useValue: mockPaypalService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: SchedulerRegistry,
          useValue: mockSchedulerRegistry,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
