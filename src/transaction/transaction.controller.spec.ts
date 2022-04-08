import { Test, TestingModule } from '@nestjs/testing';
import { TransactionCoinService } from './transaction-coin/transaction-coin.service';
import { TransactionController } from './transaction.controller';

const mockTransactionService = {};

describe('TransactionController', () => {
  let controller: TransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionCoinService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
