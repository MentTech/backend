import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetRatingsQueryDto {
  @IsNumber({}, { each: true })
  @Type(() => Number)
  @ApiProperty({
    type: Number,
    isArray: true,
  })
  ids: number[];
}
