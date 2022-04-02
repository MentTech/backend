import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TransactionService } from '../../../transaction/transaction.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { Role } from '@prisma/client';
import { AcceptSessionDto } from './dto/accept-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class RegisterService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly prisma: PrismaService,
  ) {}

  async requestSession(menteeId: number, programId: number) {
    const program = await this.prisma.program.findFirst({
      where: { id: programId },
    });
    if (!program) {
      throw new NotFoundException('Program not found');
    }
    const mentee = await this.prisma.user.findFirst({
      where: { id: menteeId, role: Role.MENTEE },
    });
    if (!mentee) {
      throw new NotFoundException('Mentee not found');
    }
    if (!this.transactionService.checkBalance(menteeId, program.credit)) {
      throw new UnprocessableEntityException('Not enough balance');
    }
    this.transactionService.menteeRequestSession(menteeId, programId);
    return this.prisma.programRegister.create({
      data: {
        user: { connect: { id: menteeId } },
        program: { connect: { id: programId } },
      },
    });
  }

  async acceptSession(sessionId: number, acceptSessionDto: AcceptSessionDto) {
    const session = await this.prisma.programRegister.findFirst({
      where: { id: sessionId, isAccepted: false, done: false },
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    if (!this.transactionService.mentorAcceptSession(sessionId)) {
      throw new UnprocessableEntityException('Session already accepted');
    }
    return this.prisma.programRegister.update({
      where: { id: sessionId },
      data: {
        isAccepted: true,
        ...acceptSessionDto,
      },
    });
  }

  async rejectSession(sessionId: number, mentorId: number) {
    const session = await this.prisma.programRegister.findFirst({
      where: {
        id: sessionId,
        isAccepted: false,
        done: false,
        program: { mentorId: mentorId },
      },
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    if (!this.transactionService.mentorRejectSession(sessionId)) {
      throw new UnprocessableEntityException('Session already accepted');
    }
    return this.prisma.programRegister.update({
      where: { id: sessionId },
      data: {
        isAccepted: false,
        done: true,
      },
    });
  }

  async menteeCloseSession(sessionId: number, menteeId: number) {
    const session = await this.prisma.programRegister.findFirst({
      where: { id: sessionId, isAccepted: true, done: false, userId: menteeId },
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return this.prisma.programRegister.update({
      where: { id: sessionId },
      data: {
        done: true,
      },
    });
  }

  mentorFindAll(mentorId: number, programId: number) {
    return this.prisma.programRegister.findMany({
      where: {
        program: { id: programId, mentorId },
      },
      include: {
        program: true,
      },
    });
  }

  menteeFindAll(menteeId: number, programId: number) {
    return this.prisma.programRegister.findMany({
      where: {
        program: { id: programId },
        user: { id: menteeId },
      },
      include: {
        program: true,
      },
    });
  }

  async mentorUpdateSession(
    sessionId: number,
    mentorId: number,
    updateSessionDto: UpdateSessionDto,
  ) {
    const session = await this.prisma.programRegister.findFirst({
      where: {
        id: sessionId,
        isAccepted: true,
        done: false,
        program: { mentorId },
      },
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return this.prisma.programRegister.update({
      where: { id: sessionId },
      data: {
        ...updateSessionDto,
      },
    });
  }

  menteeRemoveSession(sessionId: number, menteeId: number) {
    if (!this.transactionService.menteeRemoveSession(sessionId, menteeId)) {
      throw new UnprocessableEntityException('Session already accepted');
    }
    const session = this.prisma.programRegister.findFirst({
      where: {
        id: sessionId,
        userId: menteeId,
        isAccepted: false,
        done: false,
      },
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return this.prisma.programRegister.delete({
      where: { id: sessionId },
    });
  }
}
