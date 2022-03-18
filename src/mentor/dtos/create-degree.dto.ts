import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateDegreeDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  issuer: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'test',
  })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: '1564186351631',
  })
  degreeId?: string;

  @IsUrl()
  @IsOptional()
  @ApiPropertyOptional({
    type: 'url',
    example: 'https://example.com/example.pdf',
  })
  url?: string;

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
  expiredAt?: string;
}
