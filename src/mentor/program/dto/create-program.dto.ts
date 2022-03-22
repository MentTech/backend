import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProgramDto {
  @IsString()
  @ApiProperty({
    example: 'Mentoring',
  })
  title: string;

  @IsString()
  @ApiProperty({
    example: 'Mentoring',
  })
  detail: string;

  @IsNumber()
  @ApiProperty({
    example: 100,
  })
  credit: number;
}
