import { IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeAvatarDto {
  @IsUrl()
  @ApiProperty({
    type: 'string',
    format: 'url',
  })
  avatar: string;
}
