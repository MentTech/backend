import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchMentorDto {
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
  sortBy?: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @ApiPropertyOptional({
    default: false,
    type: Boolean,
  })
  order?: boolean;
}
