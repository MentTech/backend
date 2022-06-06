import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaypalPaymentDto {
  @IsNumber()
  @Min(100)
  @ApiProperty()
  token: number;
}
