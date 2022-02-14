import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Max, Min } from 'class-validator';

export class CredentialDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @Min(6)
  @Max(50)
  @ApiProperty()
  password: string;
}
