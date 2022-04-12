import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionCoinService } from './transaction-coin/transaction-coin.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [PrismaModule],
  providers: [TransactionService, TransactionCoinService],
  exports: [TransactionService, TransactionCoinService],
  controllers: [TransactionController],
})
export class TransactionModule {}
