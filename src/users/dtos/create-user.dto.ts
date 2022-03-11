import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({
    example: 'example@email.com',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @ApiProperty({
    example: '123456',
  })
  password: string;

  @IsString()
  @ApiProperty({
    example: 'John',
  })
  name: string;

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
