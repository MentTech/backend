import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendActiveEmailDto {
  @IsEmail()
  @ApiProperty({
    description: 'Email',
    example: 'example@email.com',
    type: String,
    format: 'email',
  })
  email: string;
}
