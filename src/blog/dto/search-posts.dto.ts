import { PaginationDto } from '../../dtos/pagination.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortOrder } from '../../mentor/dtos/search-mentor.dto';
import { Type } from 'class-transformer';

export enum SearchPostsOrderBy {
  publishedAt = 'publishedAt',
  updatedAt = 'updatedAt',
}

export class SearchPostsDto implements PaginationDto {
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Number of posts per page',
    default: 10,
  })
  limit: number = 10;

  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Page number',
    default: 1,
  })
  page: number = 1;

  @IsEnum(SearchPostsOrderBy)
  @ApiPropertyOptional({
    description: 'Order by',
    enum: SearchPostsOrderBy,
    default: SearchPostsOrderBy.publishedAt,
  })
  orderBy: SearchPostsOrderBy = SearchPostsOrderBy.publishedAt;

  @IsEnum(SortOrder)
  @ApiPropertyOptional({
    description: 'Sort order',
    enum: SortOrder,
    default: SortOrder.DESC,
  })
  orderDirection: SortOrder = SortOrder.DESC;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Search query',
  })
  keyword?: string;

  @IsNumber({}, { each: true })
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'List of categories',
  })
  categories: number[] = [];

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional()
  authorId?: number;
}
