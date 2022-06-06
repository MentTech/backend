import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProfitQueryDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Number of month',
    default: 6,
  })
  months: number = 6;
}
