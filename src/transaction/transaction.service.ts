import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionService {
  checkBalance(userId: number, amount: number): boolean {
    return true;
  }

  menteeRequestSession(menteeId: number, programId: number): boolean {
    return true;
  }

  mentorAcceptSession(sessionId: number) {
    return true;
  }

  mentorRejectSession(sessionId: number) {
    return true;
  }

  menteeRemoveSession(sessionId: number, menteeId: number) {
    return true;
  }
}
