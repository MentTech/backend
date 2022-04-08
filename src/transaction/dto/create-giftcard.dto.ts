import { IsDate, IsInt, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGiftCardDto {
  @IsString()
  @ApiPropertyOptional({
    description: 'The name of the gift card',
    default: 'Gift Card',
  })
  type: string = 'Gift Card';

  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({
    type: 'string',
    format: 'date-time',
    description: 'The date the gift card begin to valid',
  })
  validFrom: Date = new Date();

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'The date the gift card expires',
  })
  validTo: Date;

  @IsNumber()
  @ApiPropertyOptional({
    description: 'The amount of usage left',
    default: 1,
  })
  usageLeft: number = 1;

  @IsInt()
  @ApiProperty({
    description: 'Gift card value',
    example: 1000,
  })
  coin: number;
}
