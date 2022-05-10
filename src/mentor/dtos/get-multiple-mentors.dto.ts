import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetMultipleMentorsDto {
  @IsNumber({}, { each: true })
  @Type(() => Number)
  @ApiProperty({
    type: [Number],
    description: 'Mentor ids',
  })
  ids: number[];
}
