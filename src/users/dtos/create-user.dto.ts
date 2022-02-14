import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  name: string;
}
