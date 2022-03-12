import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class JobDto {
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    type: 'datestring',
    example: '2011-10-05T14:48:00.000Z',
  })
  startDate?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    type: 'datestring',
    example: '2011-10-05T14:48:00.000Z',
  })
  endDate?: string;

  @IsString()
  @ApiProperty()
  company: string;

  @IsString()
  @ApiProperty()
  position: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: 'object',
  })
  additional?: any;
}
