import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class MarkMultipleNotificationDto {
  @IsNumber({}, { each: true })
  @ApiProperty({
    type: [Number],
  })
  ids: number[];
}
