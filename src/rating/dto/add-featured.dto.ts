import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AddFeaturedDto {
  @IsInt()
  @ApiProperty()
  id: number;
}
