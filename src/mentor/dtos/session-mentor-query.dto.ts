import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { SessionStatisticMentorQueryDto } from './session-statistic-mentor-query.dto';
import { PaginationDto } from '../../dtos/pagination.dto';
import { IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { SortOrder } from './search-mentor.dto';

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

  @IsEnum(SortOrder)
  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.DESC })
  orderDirection: SortOrder = SortOrder.DESC;
}
