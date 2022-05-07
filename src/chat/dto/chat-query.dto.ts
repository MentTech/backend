import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ChatQueryDto {
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({
    default: 10,
  })
  limit: number = 10;

  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({
    default: 0,
  })
  skip: number;
}
