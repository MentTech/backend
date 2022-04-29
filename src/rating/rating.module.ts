import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RatingController } from './rating.controller';

@Module({
  imports: [PrismaModule],
  controllers: [RatingController],
  providers: [RatingService],
  exports: [RatingService],
})
export class RatingModule {}
