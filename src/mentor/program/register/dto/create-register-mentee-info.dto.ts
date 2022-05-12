import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRegisterMenteeInfoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  description: string = '';

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  note: string = '';

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  expectation: string = '';

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  goal: string = '';
}
