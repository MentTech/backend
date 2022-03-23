import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../dtos/pagination.dto';

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

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'price',
  })
  orderBy: string = 'date';

  @IsBoolean()
  @Type(() => Boolean)
  @ApiPropertyOptional({
    default: 'desc',
    description: 'asc or desc',
    type: String,
  })
  order: 'asc' | 'desc' = 'desc';

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
