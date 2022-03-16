import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @ApiProperty({
    description: 'Category name',
    example: 'category',
  })
  name: string;
}
