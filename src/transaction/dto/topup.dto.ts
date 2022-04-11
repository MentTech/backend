import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber } from 'class-validator';

export class TopUpDto {
  @IsNumber()
  @ApiProperty()
  userId: number;

  @IsInt()
  @ApiProperty()
  amount: number;
}
