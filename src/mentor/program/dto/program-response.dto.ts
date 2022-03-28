import { Program } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

interface IProgram extends Program {}

export class ProgramResponseDto implements IProgram {
  @ApiProperty({
    description: 'Program ID',
    example: 1,
  })
  id: number;
  @ApiProperty({
    description: 'MentorId',
    example: 'John',
  })
  mentorId: number;
  @ApiProperty({
    description: 'Title',
    example: 'Mock interview',
  })
  title: string;
  @ApiProperty({
    description: 'Description',
    example: 'Mock interview',
  })
  detail: string;
  @ApiProperty({
    description: 'Credit',
    example: 100,
  })
  credit: number;
  @ApiProperty({
    description: 'CreatedAt',
    example: '2020-01-01',
  })
  createAt: Date;
}
