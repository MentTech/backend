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
import { TransactionCoinService } from '../../../transaction/transaction-coin/transaction-coin.service';
import { SendNotificationService } from '../../../notification/send-notification.service';
import { CreateRegisterMenteeInfoDto } from './dto/create-register-mentee-info.dto';
import { SessionQueryDto } from '../../../dtos/session-query.dto';

@Injectable()
export class RegisterService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly transactionCoinService: TransactionCoinService,
    private readonly prisma: PrismaService,
    private readonly sendNotificationService: SendNotificationService,
  ) {}

  async requestSession(
    menteeId: number,
    programId: number,
    dto: CreateRegisterMenteeInfoDto,
  ) {
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
    const registers = await this.prisma.programRegister.findMany({
      where: {
        user: { id: menteeId },
        program: { id: programId },
      },
    });
    registers.forEach((e) => {
      if (!e.done) {
        throw new UnprocessableEntityException(
          'You have already registered for this program',
        );
      }
    });
    const session = await this.transactionCoinService.menteeRequestSession(
      menteeId,
      programId,
      dto,
    );
    await this.sendNotificationService.menteeRequestSession(session.id);
    return session;
    // if (!this.transactionService.checkBalance(menteeId, program.credit)) {
    //   throw new UnprocessableEntityException('Not enough balance');
    // }
    // this.transactionService.menteeRequestSession(menteeId, programId);
    // return this.prisma.programRegister.create({
    //   data: {
    //     user: { connect: { id: menteeId } },
    //     program: { connect: { id: programId } },
    //   },
    // });
  }

  async acceptSession(sessionId: number, acceptSessionDto: AcceptSessionDto) {
    const session = await this.prisma.programRegister.findFirst({
      where: { id: sessionId, isAccepted: false, done: false },
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    const newSession = await this.prisma.programRegister.update({
      where: { id: sessionId },
      data: {
        isAccepted: true,
        ...acceptSessionDto,
      },
    });
    await this.sendNotificationService.mentorAcceptSession(newSession.id);
    return newSession;
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
    const newSession = await this.transactionCoinService.mentorRefuseSession(
      sessionId,
    );
    await this.sendNotificationService.mentorRejectSession(newSession.id);
    return newSession;
    // if (!this.transactionService.mentorRejectSession(sessionId)) {
    //   throw new UnprocessableEntityException('Session already accepted');
    // }
    // return this.prisma.programRegister.update({
    //   where: { id: sessionId },
    //   data: {
    //     isAccepted: false,
    //     done: true,
    //   },
    // });
  }

  async menteeCloseSession(sessionId: number, menteeId: number) {
    const session = await this.prisma.programRegister.findFirst({
      where: { id: sessionId, isAccepted: true, done: false, userId: menteeId },
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    await this.transactionCoinService.completeSession(sessionId);
    const chatRoom = await this.prisma.chatRoom.findFirst({
      where: {
        sessionId,
      },
    });
    if (chatRoom) {
      await this.prisma.chatRoom.update({
        where: { id: chatRoom.id },
        data: {
          isActive: false,
        },
      });
    }
    // return this.prisma.programRegister.update({
    //   where: { id: sessionId },
    //   data: {
    //     done: true,
    //   },
    // });
  }

  mentorFindAll(mentorId: number, programId: number, query: SessionQueryDto) {
    return this.prisma.programRegister.findMany({
      where: {
        program: { id: programId, mentorId },
        ...query,
      },
      include: {
        program: true,
        user: true,
        menteeInfo: true,
      },
    });
  }

  menteeFindAll(menteeId: number, programId: number, query: SessionQueryDto) {
    return this.prisma.programRegister.findMany({
      where: {
        program: { id: programId },
        user: { id: menteeId },
        ...query,
      },
      include: {
        program: true,
        menteeInfo: true,
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

  async menteeRemoveSession(sessionId: number, menteeId: number) {
    const session = await this.prisma.programRegister.findFirst({
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
    return this.transactionCoinService.mentorRefuseSession(sessionId);
  }
}
