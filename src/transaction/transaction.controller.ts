import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TransactionCoinService } from './transaction-coin/transaction-coin.service';
import { CreateGiftCardDto } from './dto/create-giftcard.dto';
import { ApplyGiftCardDto } from './dto/apply-giftcard.dto';
import { GetUser } from '../decorators/get-user.decorator';
import { Role, User } from '@prisma/client';
import JwtAuthenticationGuard from '../auth/guards/jwt-authentiacation.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TopUpDto } from './dto/topup.dto';
import { BalanceResponseDto } from './dto/balance-response.dto';

@Controller('transaction')
@ApiTags('Transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionCoinService) {}

  @Get('/balance')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Get all user transactions and balance' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Return transactions',
    type: BalanceResponseDto,
  })
  getTransactions(@GetUser() user: User) {
    return this.transactionService.getTransactions(user.id);
  }

  @Get('/card')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all gift cards (ADMIN)' })
  @ApiBearerAuth()
  getAllGiftCard() {
    return this.transactionService.getAllGiftCard();
  }

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

  @Post('/topup')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'TopUp a user' })
  @ApiBearerAuth()
  async topUp(@Body() body: TopUpDto) {
    await this.transactionService.topUpByAdmin(body.userId, body.amount);
    return {
      message: 'TopUp successfully',
    };
  }
}
