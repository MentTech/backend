import { PaginationDto } from '../../dtos/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetRatingQueryDto implements PaginationDto {
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Number of item per page',
    example: 3,
    default: 5,
  })
  limit: number = 5;

  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Page number',
    default: 1,
    example: 1,
  })
  page: number = 1;
}
