import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PaypalSuccessQueryDto {
  @IsString()
  @ApiProperty()
  PayerID: string;

  @IsString()
  @ApiProperty()
  paymentId: string;
}
