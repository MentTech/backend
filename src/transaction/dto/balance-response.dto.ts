import {UserTransaction} from "@prisma/client";

export class BalanceResponseDto {
  balance: number;
  transactions: UserTransaction[];

  constructor(props: Partial<BalanceResponseDto>) {
    Object.assign(this, props);
  }

}