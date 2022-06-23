import { Test, TestingModule } from '@nestjs/testing';
import { RegisterService } from './register.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { TransactionService } from '../../../transaction/transaction.service';
import { NotFoundException } from '@nestjs/common';
import { TransactionCoinService } from '../../../transaction/transaction-coin/transaction-coin.service';
import { SendNotificationService } from '../../../notification/send-notification.service';
import { CreateRegisterMenteeInfoDto } from './dto/create-register-mentee-info.dto';

const singleProgram = {
  id: 1,
  title: 'Program 1',
  detail: 'Program 1 description',
  done: true,
};

const singleMentee = {
  id: 2,
  name: 'Mentee 1',
  email: 'asd@asd.com',
};

const singleSession = {
  id: 1,
};

describe('RegisterService', () => {
  let service: RegisterService;
  let prisma: PrismaService;
  let transaction: TransactionService;
  let transactionCoinService: TransactionCoinService;
  let sendNotificationService: SendNotificationService;

  const _beforeEach = async () => {
    const mockPrismaService = {
      program: {
        findFirst: jest.fn().mockResolvedValue(singleProgram),
      },
      user: {
        findFirst: jest.fn().mockResolvedValue(singleMentee),
      },
      programRegister: {
        create: jest.fn().mockResolvedValue(singleSession),
        findFirst: jest.fn().mockResolvedValue(singleSession),
        update: jest.fn().mockResolvedValue(singleSession),
        findMany: jest.fn().mockResolvedValue([singleProgram]),
        delete: jest.fn().mockResolvedValue(singleSession),
      },
    };
    const mockTransactionService = {
      checkBalance: jest.fn().mockResolvedValue(true),
      menteeRequestSession: jest.fn().mockResolvedValue(true),
      mentorAcceptSession: jest.fn().mockResolvedValue(true),
      mentorRejectSession: jest.fn().mockResolvedValue(true),
      menteeRemoveSession: jest.fn().mockResolvedValue(true),
    };
    const mockTransactionCoinService = {
      menteeRequestSession: jest.fn().mockResolvedValue(singleSession),
      mentorRefuseSession: jest.fn().mockResolvedValue(singleSession),
    };
    const mockSendNotificationService = {
      menteeRequestSession: jest.fn().mockResolvedValue(true),
      mentorAcceptSession: jest.fn().mockResolvedValue(true),
      mentorRejectSession: jest.fn().mockResolvedValue(true),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
        {
          provide: TransactionCoinService,
          useValue: mockTransactionCoinService,
        },
        {
          provide: SendNotificationService,
          useValue: mockSendNotificationService,
        },
      ],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
    prisma = module.get<PrismaService>(PrismaService);
    transaction = module.get<TransactionService>(TransactionService);
    transactionCoinService = module.get<TransactionCoinService>(
      TransactionCoinService,
    );
    sendNotificationService = module.get<SendNotificationService>(
      SendNotificationService,
    );
  };

  beforeEach(_beforeEach);

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('requestSession', () => {
    beforeEach(_beforeEach);
    it('should request new session', async () => {
      const result = await service.requestSession(
        1,
        1,
        {} as CreateRegisterMenteeInfoDto,
      );
      expect(result).toEqual(singleSession);
    });

    it('should throw error if program not found', async () => {
      jest.spyOn(prisma.program, 'findFirst').mockResolvedValue(null);
      await expect(
        service.requestSession(1, 1, {} as CreateRegisterMenteeInfoDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw error if mentee not found', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);
      await expect(
        service.requestSession(1, 1, {} as CreateRegisterMenteeInfoDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('acceptSession', () => {
    beforeEach(_beforeEach);
    it('should accept session', async () => {
      const result = await service.acceptSession(1, {
        contactInfo: 'asd',
        expectedDate: new Date(),
      });
      expect(prisma.programRegister.findFirst).toBeCalled();
      expect(prisma.programRegister.update).toBeCalled();
      expect(result).toEqual(singleSession);
    });

    it('should throw error if session not found', async () => {
      prisma.programRegister.findFirst = jest.fn().mockResolvedValue(null);
      await expect(
        service.acceptSession(1, {
          contactInfo: 'asd',
          expectedDate: new Date(),
        }),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('rejectSession', () => {
    beforeEach(_beforeEach);
    it('should reject session', async () => {
      const result = await service.rejectSession(1, 1);
      expect(prisma.programRegister.findFirst).toBeCalled();
      expect(result).toEqual(singleSession);
    });

    it('should throw error if session is not found', async () => {
      prisma.programRegister.findFirst = jest.fn().mockResolvedValue(null);
      await expect(service.rejectSession(1, 1)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  it('should get all sessions (mentor)', async () => {
    const result = await service.mentorFindAll(1, 1, {});
    expect(result).toEqual([singleProgram]);
  });

  it('should get all sessions (mentee)', async () => {
    const result = await service.menteeFindAll(1, 1, {});
    expect(result).toEqual([singleProgram]);
  });

  describe('mentorUpdateSession', () => {
    beforeEach(_beforeEach);

    it('should update session', async () => {
      const result = await service.mentorUpdateSession(1, 1, {
        contactInfo: 'asd',
      });
      expect(prisma.programRegister.findFirst).toBeCalled();
      expect(prisma.programRegister.update).toBeCalled();
      expect(result).toEqual(singleSession);
    });

    it('should throw error if session is not found', async () => {
      prisma.programRegister.findFirst = jest.fn().mockResolvedValue(null);
      await expect(
        service.mentorUpdateSession(1, 1, {
          contactInfo: 'asd',
        }),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('menteeRemoveSession', () => {
    beforeEach(_beforeEach);

    it('should remove session', async () => {
      const result = await service.menteeRemoveSession(1, 1);
      expect(prisma.programRegister.findFirst).toBeCalled();
      expect(result).toEqual(singleSession);
    });
  });
});
