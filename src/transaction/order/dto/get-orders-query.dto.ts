import { PaginationDto } from '../../../dtos/pagination.dto';
import { IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortOrder } from '../../../mentor/dtos/search-mentor.dto';

enum OrderByType {
  createAt = 'createAt',
  total = 'total',
  updatedAt = 'updatedAt',
  status = 'status',
  orderType = 'orderType',
}

export class GetOrdersQueryDto implements PaginationDto {
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({
    default: 1,
  })
  page: number = 1;

  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({
    default: 10,
  })
  limit: number = 10;

  @IsEnum(OrderByType)
  @ApiPropertyOptional({
    default: OrderByType.createAt,
  })
  orderBy: OrderByType = OrderByType.createAt;

  @IsEnum(SortOrder)
  @ApiPropertyOptional({
    default: SortOrder.DESC,
  })
  orderByDirection: SortOrder = SortOrder.DESC;
}
