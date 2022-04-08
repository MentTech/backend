import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyGiftCardDto {
  @IsString()
  @ApiProperty()
  code: string;
}
