import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { TransactionModule } from '../../../transaction/transaction.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { RegisterRatingService } from './register-rating.service';
import { RegisterRatingController } from './register-rating.controller';

@Module({
  imports: [TransactionModule, PrismaModule],
  controllers: [RegisterController, RegisterRatingController],
  providers: [RegisterService, RegisterRatingService],
})
export class RegisterModule {}
