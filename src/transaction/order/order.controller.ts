import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import JwtAuthenticationGuard from '../../auth/guards/jwt-authentiacation.guard';
import { GetUser } from '../../decorators/get-user.decorator';
import { Role, User } from '@prisma/client';
import { GetOrdersQueryDto } from './dto/get-orders-query.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTopUpOrderDto } from './dto/create-top-up-order.dto';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { ProcessTopUpOrderDto } from './dto/process-top-up-order.dto';
import { CreateWithdrawOrderDto } from './dto/create-withdraw-order.dto';

@Controller('order')
@ApiTags('Order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({
    summary: 'Get orders',
  })
  @ApiBearerAuth()
  async getOrders(@GetUser() user: User, @Query() query: GetOrdersQueryDto) {
    if (user.role === Role.ADMIN) {
      return this.orderService.getOrdersPagination(query);
    }
    return this.orderService.getOrdersPagination(query, {
      userId: user.id,
    });
  }

  @Get('/:id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({
    summary: 'Get order',
  })
  @ApiBearerAuth()
  async getOrder(@GetUser() user: User, @Param('id') id: string) {
    if (user.role === Role.ADMIN) {
      return this.orderService.getOrder({ id: +id });
    }
    return this.orderService.getOrder({ id: +id, userId: user.id });
  }

  @Get('/order-id/:orderId')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({
    summary: 'Get order by orderId',
  })
  @ApiBearerAuth()
  getOrderByOrderId(@GetUser() user: User, @Param('orderId') id: string) {
    if (user.role === Role.ADMIN) {
      return this.orderService.getOrder({ orderId: id });
    }
    return this.orderService.getOrder({ orderId: id, userId: user.id });
  }

  @Post('/top-up')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({
    summary: 'Create top up order',
  })
  @ApiBearerAuth()
  async createTopUpOrder(
    @GetUser() user: User,
    @Body() dto: CreateTopUpOrderDto,
  ) {
    return this.orderService.createTopUpOrder(user.id, dto);
  }

  @Post('/withdraw')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.MENTOR)
  @ApiOperation({
    summary: 'Create withdraw order',
  })
  @ApiBearerAuth()
  createWithdrawOrder(
    @GetUser() user: User,
    @Body() dto: CreateWithdrawOrderDto,
  ) {
    return this.orderService.createWithdrawOrder(user.id, dto);
  }

  @Patch('/withdraw/:id')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Process withdraw order',
  })
  @ApiBearerAuth()
  processWithdrawOrder(
    @Param('id') id: string,
    @Body() dto: ProcessTopUpOrderDto,
  ) {
    return this.orderService.processWithdrawOrder(id, dto.isAccept);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Process order',
  })
  @ApiBearerAuth()
  async processTopUpOrder(
    @Param('id') id: string,
    @Body() dto: ProcessTopUpOrderDto,
  ) {
    return this.orderService.processTopUpOrder(id, dto.isAccept);
  }

  @Get('/rate/top-up')
  @ApiOperation({
    summary: 'Get top up rate',
  })
  async getTopUpRate() {
    return this.orderService.getTopUpRate();
  }

  @Get('/rate/withdraw')
  @ApiOperation({
    summary: 'Get withdraw rate',
  })
  getWithdrawRate() {
    return this.orderService.getWithdrawRate();
  }
}
