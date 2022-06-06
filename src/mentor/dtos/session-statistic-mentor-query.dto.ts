import { IsBoolean, IsDate, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
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
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @ApiPropertyOptional({
    description: 'Is accepted (omit to get all)',
  })
  isAccepted?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @ApiPropertyOptional({
    description: 'Is done (omit to get all)',
  })
  isDone?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @ApiPropertyOptional({
    description: 'Is canceled (omit to get all)',
  })
  isCanceled?: boolean;
}
