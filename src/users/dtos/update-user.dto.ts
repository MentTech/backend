import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({
    example: 'example@email.com',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'John Mike',
  })
  name?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    example: '2011-10-05T14:48:00.000Z',
  })
  birthday?: string;

  @IsOptional()
  @IsString()
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
