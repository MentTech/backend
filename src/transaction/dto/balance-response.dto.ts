import { UserTransaction } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class BalanceResponseDto {
  @ApiProperty()
  balance: number;

  @ApiProperty()
  transactions: UserTransaction[];

  constructor(props: Partial<BalanceResponseDto>) {
    Object.assign(this, props);
  }
}
