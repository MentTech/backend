import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateDegreeDto } from '../degree/dto/create-degree.dto';
import { CreateExperienceDto } from '../experience/dto/create-experience.dto';

//import { JobDto } from './job.dtos';

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

  @ValidateNested({
    each: true,
  })
  @Type(() => CreateDegreeDto)
  @ApiProperty({
    type: [CreateDegreeDto],
  })
  degree: CreateDegreeDto[];

  @ValidateNested({
    each: true,
  })
  @Type(() => CreateExperienceDto)
  @ApiProperty({
    type: [CreateExperienceDto],
  })
  experiences: CreateExperienceDto[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'harukishima',
  })
  linkedin?: string;

  // @ValidateNested({ each: true })
  // @Type(() => JobDto)
  // @ApiProperty({
  //   type: [JobDto],
  // })
  // jobs: JobDto[];

  @IsString({ each: true })
  @ApiProperty({
    example: ['1', '2'],
  })
  achievements: string[];

  @IsNumber({}, { each: true })
  @ApiProperty({
    example: [1, 2],
  })
  skillIds: number[];

  @IsNumber()
  @ApiProperty({
    example: 1,
  })
  categoryId: number;

  @IsString()
  @ApiProperty({
    example: 'Hello',
  })
  introduction: string;
}
