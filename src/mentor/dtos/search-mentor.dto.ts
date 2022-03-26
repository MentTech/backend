import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../dtos/pagination.dto';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum SortBy {
  NAME = 'name',
  RATING = 'rating',
}

export class SearchMentorDto implements PaginationDto {
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
