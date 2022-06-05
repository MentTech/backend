import { IsEmail, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWithdrawOrderDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Optional note, write bank account number here',
  })
  note: string = '';

  @IsNumber()
  @Min(1000)
  @ApiProperty({
    minimum: 1000,
  })
  token: number;
}
