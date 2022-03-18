import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  company: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  description?: string;

  @IsDateString()
  @ApiProperty({
    type: 'datestring',
    example: '2011-10-05T14:48:00.000Z',
  })
  startAt: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    type: 'datestring',
    example: '2011-10-05T14:48:00.000Z',
  })
  endAt?: string;
}
