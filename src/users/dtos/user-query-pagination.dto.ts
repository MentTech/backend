import { PaginationDto } from '../../dtos/pagination.dto';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { SortOrder } from '../../mentor/dtos/search-mentor.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum OrderBy {
  NAME = 'name',
  EMAIL = 'email',
  CREATE = 'createAt',
}

export class UserQueryPaginationDto implements PaginationDto {
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional()
  limit: number = 10;

  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional()
  page: number = 1;

  @IsEnum(OrderBy)
  @ApiPropertyOptional({
    enum: OrderBy,
  })
  orderBy: OrderBy = OrderBy.CREATE;

  @IsEnum(SortOrder)
  @ApiPropertyOptional({
    enum: SortOrder,
  })
  order: SortOrder = SortOrder.DESC;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  search?: string;
}
