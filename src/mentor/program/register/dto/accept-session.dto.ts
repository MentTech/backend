import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class AcceptSessionDto {
  @IsString()
  @ApiProperty()
  contactInfo: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
  })
  expectedDate: Date;
}
