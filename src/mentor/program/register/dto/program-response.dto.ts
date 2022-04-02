import { ApiProperty } from '@nestjs/swagger';

export class ProgramResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  mentorId: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  detail: string;
  @ApiProperty()
  credit: number;
  @ApiProperty()
  createAt: Date;

  constructor(program: Partial<ProgramResponseDto>) {
    Object.assign(this, program);
  }
}
