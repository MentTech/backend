import { TransactionStatus, TransactionType } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../dtos/pagination.dto';
import { Type } from 'class-transformer';
import { SortOrder } from '../../mentor/dtos/search-mentor.dto';

export class TransactionQueryDto implements PaginationDto {
  @IsEnum(TransactionStatus)
  @IsOptional()
  @ApiPropertyOptional({
    enum: TransactionStatus,
  })
  status?: TransactionStatus;

  @IsEnum(TransactionType)
  @IsOptional()
  @ApiPropertyOptional({
    enum: TransactionType,
  })
  type?: TransactionType;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    default: 1,
  })
  page: number = 1;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    default: 10,
  })
  limit: number = 10;

  @IsEnum(SortOrder)
  @IsOptional()
  @ApiPropertyOptional({
    enum: SortOrder,
    default: SortOrder.DESC,
  })
  orderByDirection: SortOrder = SortOrder.DESC;
}
