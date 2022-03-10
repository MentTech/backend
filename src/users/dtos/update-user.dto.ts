import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'example@email.com',
  })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'John Mike',
  })
  name?: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    example: '2019-06-11T00:00',
  })
  birthday?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: '012345678',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'avatar.png',
  })
  avatar?: string;
}
