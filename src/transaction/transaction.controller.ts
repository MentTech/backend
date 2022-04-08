import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TransactionCoinService } from './transaction-coin/transaction-coin.service';
import { CreateGiftCardDto } from './dto/create-giftcard.dto';
import { ApplyGiftCardDto } from './dto/apply-giftcard.dto';
import { GetUser } from '../decorators/get-user.decorator';
import { Role, User } from '@prisma/client';
import JwtAuthenticationGuard from '../auth/guards/jwt-authentiacation.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('transaction')
@ApiTags('Transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionCoinService) {}

  @Post('/card')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a gift card' })
  @ApiBearerAuth()
  createGiftCard(@Body() body: CreateGiftCardDto) {
    return this.transactionService.createGiftCard(body);
  }

  @Post('/card/apply')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.MENTEE)
  @ApiOperation({ summary: 'Apply a gift card' })
  @ApiBearerAuth()
  async applyGiftCard(@GetUser() user: User, @Body() body: ApplyGiftCardDto) {
    await this.transactionService.applyGiftCard(user.id, body.code);
    return {
      message: 'Gift card applied successfully',
    };
  }
}
