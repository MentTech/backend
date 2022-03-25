import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { TransactionModule } from '../../../transaction/transaction.module';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
  imports: [TransactionModule, PrismaModule],
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class RegisterModule {}
