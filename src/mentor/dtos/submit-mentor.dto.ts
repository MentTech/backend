import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { JobDto } from './job.dtos';

export class SubmitMentorDto {
  @IsEmail()
  @ApiProperty({
    example: 'example@email.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    example: 'John',
  })
  name: string;

  @IsDateString()
  @ApiProperty({
    type: 'datestring',
    example: '2011-10-05T14:48:00.000Z',
  })
  birthday: string;

  @IsString()
  @ApiProperty({
    example: '0123456789',
  })
  phone: string;

  @IsString()
  @ApiProperty({
    example: 'avatar.png',
  })
  avatar: string;

  @IsString({
    each: true,
  })
  @ApiProperty({
    example: ['CS', 'SE'],
  })
  degree: string[];

  @IsString({
    each: true,
  })
  @ApiProperty({
    example: ['1', '2'],
  })
  experiences: string[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'harukishima',
  })
  linkedin?: string;

  @ValidateNested({ each: true })
  @Type(() => JobDto)
  @ApiProperty({
    type: JobDto,
  })
  jobs: JobDto[];

  @IsString({ each: true })
  @ApiProperty({
    example: ['1', '2'],
  })
  achievements: string[];

  @IsString({ each: true })
  @ApiProperty({
    example: ['1', '2'],
  })
  skills: string[];

  @IsString()
  @ApiProperty({
    example: 'BE',
  })
  field: string;

  @IsString()
  @ApiProperty({
    example: 'Hello',
  })
  introduction: string;
}
