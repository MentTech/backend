import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto<T> {
  @ApiProperty({
    type: [Object],
    description: 'List of items',
  })
  data: T[];
  @ApiProperty({
    type: Number,
    description: 'Total number of items',
  })
  totalPage: number;
  @ApiProperty({
    type: Number,
    description: 'Page number',
  })
  page: number;
  @ApiProperty({
    type: Number,
    description: 'Number of items per page',
  })
  limit: number;

  constructor(c: Partial<PaginationResponseDto<T>>) {
    Object.assign(this, c);
  }
}
