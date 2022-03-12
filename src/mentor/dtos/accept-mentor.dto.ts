import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class AcceptMentorDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: '1',
    description: 'mentor id',
  })
  id: number;
}
