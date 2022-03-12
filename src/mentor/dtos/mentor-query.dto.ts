import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class MentorQueryDto {
  @ApiPropertyOptional({
    default: 'false',
    description: 'query for pending mentors',
  })
  @IsOptional()
  @Type(() => Boolean)
  pending?: boolean;
}
