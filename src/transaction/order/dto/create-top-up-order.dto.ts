import { PaymentMethod } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTopUpOrderDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsEnum(PaymentMethod)
  @ApiProperty({
    enum: PaymentMethod,
    default: PaymentMethod.WireTransfer,
  })
  paymentMethod: PaymentMethod;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  note: string = '';

  @IsNumber()
  @Min(100)
  @ApiProperty({
    minimum: 100,
  })
  token: number;
}
