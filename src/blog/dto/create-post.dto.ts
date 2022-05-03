import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  summary?: string;

  @IsUrl()
  @IsOptional()
  @ApiPropertyOptional()
  image?: string;

  @IsNumber({}, { each: true })
  @ApiProperty({ type: [Number] })
  categories: number[];

  @IsBoolean()
  @ApiProperty()
  isPrivate: boolean;

  @IsBoolean()
  @ApiProperty()
  isPublished: boolean;
}
