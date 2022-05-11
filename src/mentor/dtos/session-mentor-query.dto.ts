import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { SessionStatisticMentorQueryDto } from './session-statistic-mentor-query.dto';
import { PaginationDto } from '../../dtos/pagination.dto';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class SessionMentorQueryDto
  extends PartialType(SessionStatisticMentorQueryDto)
  implements PaginationDto
{
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ type: Number, default: 10 })
  limit: number = 10;

  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ type: Number, default: 1 })
  page: number = 1;
}
