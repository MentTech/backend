import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  @ApiProperty({
    example: 'Skill name',
  })
  description: string;
}
