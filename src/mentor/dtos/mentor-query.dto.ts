import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class MentorQueryDto {
  @ApiPropertyOptional({
    default: 'false',
    description: 'query for pending mentors',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  pending?: boolean;
}
