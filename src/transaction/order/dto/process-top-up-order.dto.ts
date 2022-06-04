import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessTopUpOrderDto {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether to process the order',
  })
  isAccept: boolean;
}
