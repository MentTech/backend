import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRatingDto {
  @IsNumber()
  @Min(0)
  @Max(5)
  @ApiProperty({
    description: 'Rating value',
  })
  rating: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Comment',
  })
  comment?: string;
}
