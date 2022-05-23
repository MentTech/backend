import { IsBoolean, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SessionStatisticMentorQueryDto {
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional({
    type: 'string',
    format: 'date-time',
    description: 'Start date',
  })
  from?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional({
    type: 'string',
    format: 'date-time',
    description: 'End date',
  })
  to?: Date;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @ApiPropertyOptional({
    description: 'Is accepted (omit to get all)',
  })
  isAccepted?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @ApiPropertyOptional({
    description: 'Is done (omit to get all)',
  })
  isDone?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @ApiPropertyOptional({
    description: 'Is canceled (omit to get all)',
  })
  isCanceled?: boolean;
}
