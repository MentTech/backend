import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MentorVerifyInfoDto {
  @IsString()
  @ApiProperty()
  dataSign: string;

  @IsString()
  @ApiProperty()
  dataBase64: string;
}
