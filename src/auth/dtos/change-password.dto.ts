import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @ApiProperty({
    example: 'password',
  })
  oldPassword: string;

  @IsString()
  @ApiProperty({
    example: 'newPassword',
  })
  newPassword: string;
}
