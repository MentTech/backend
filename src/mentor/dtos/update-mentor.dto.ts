import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMentorDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Mentor linkedin profile url' })
  linkedin?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Description of the mentor' })
  introduction?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ description: 'New category id' })
  categoryId?: number;

  @IsNumber({}, { each: true })
  @IsOptional()
  @ApiPropertyOptional({ description: 'New skill ids', type: [Number] })
  skillIds?: number[];
}
