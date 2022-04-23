import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationSortDto } from '../../dtos/pagination-sort.dto';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum SortBy {
  NAME = 'name',
  CREATEAT = 'createAt',
}

export class SearchMentorDto implements PaginationSortDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'mentor',
  })
  keyword?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    example: 1,
    type: Number,
  })
  category?: number;

  @IsNumber({}, { each: true })
  @Type(() => Number)
  @IsOptional()
  @ApiPropertyOptional({
    example: [1, 2],
    type: [Number],
  })
  skills?: number[];

  @IsEnum(SortBy)
  @IsOptional()
  @ApiPropertyOptional({
    example: SortBy.NAME,
    default: SortBy.NAME,
    enum: SortBy,
  })
  orderBy: string = SortBy.NAME;

  @IsEnum(SortOrder)
  @IsOptional()
  @ApiPropertyOptional({
    type: SortOrder,
    enum: Object.values(SortOrder),
    default: SortOrder.DESC,
  })
  order: SortOrder = SortOrder.DESC;

  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({
    example: 1,
    default: 1,
    type: Number,
  })
  page: number = 1;

  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({
    example: 10,
    default: 10,
    type: Number,
  })
  limit: number = 10;
}
