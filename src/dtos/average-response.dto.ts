import { ApiProperty } from '@nestjs/swagger';

export class AverageResponseDto {
  @ApiProperty()
  average: number;
  @ApiProperty()
  count: number;

  constructor(props: Partial<AverageResponseDto>) {
    Object.assign(this, props);
  }
}
