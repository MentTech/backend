import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class SessionQueryDto {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @ApiPropertyOptional()
  isCanceled?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @ApiPropertyOptional()
  isAccepted?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @ApiPropertyOptional()
  done?: boolean;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    description: 'start expected date range (leave empty for no limit)',
  })
  expectedStartDate?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    description: 'end expected date range (leave empty for no limit)',
  })
  expectedEndDate?: Date;
}
