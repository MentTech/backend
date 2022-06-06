import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { TransactionModule } from '../transaction.module';
import { PaypalModule } from '../../paypal/paypal.module';

@Module({
  imports: [PrismaModule, forwardRef(() => TransactionModule), PaypalModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
