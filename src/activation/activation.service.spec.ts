import { Test, TestingModule } from '@nestjs/testing';
import { ActivationService } from './activation.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { Role } from '@prisma/client';
import { ConflictException, NotFoundException } from '@nestjs/common';

const singleToken = {
  id: 1,
  code: '123456789',
  userId: 1,
  isUsed: false,
  createdAt: new Date(),
  expiredIn: 3600,
};

const singleUser = {
  id: 1,
  email: 'awsd@asd.com',
  password: '123456',
  name: 'test',
  role: Role.MENTEE,
  birthday: new Date(),
  phone: '0123456789',
  isActive: false,
  avatar: '',
  coin: 0,
  isPasswordSet: true,
  createAt: new Date(),
};

const mockPrismaService = {
  activationCode: {
    findFirst: jest.fn().mockResolvedValue(singleToken),
    delete: jest.fn().mockResolvedValue(singleToken),
    create: jest.fn().mockResolvedValue(singleToken),
    findMany: jest.fn().mockResolvedValue([singleToken]),
    update: jest.fn().mockResolvedValue(singleToken),
  },
  user: {
    findFirst: jest.fn().mockResolvedValue(singleUser),
    update: jest.fn().mockResolvedValue(singleUser),
  },
};
const mockMailService = {
  sendUserConfirmationEmail: jest.fn().mockResolvedValue(null),
};

describe('ActivationService', () => {
  let service: ActivationService;
  let prisma: PrismaService;
  let mailService: MailService;

  const before = async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    service = module.get<ActivationService>(ActivationService);
    prisma = module.get<PrismaService>(PrismaService);
    mailService = module.get<MailService>(MailService);
  };

  beforeEach(before);

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendActivationEmail', () => {
    beforeEach(before);

    it('should send an activation email', async () => {
      const message = await service.sendActivationEmail(singleUser);
      expect(message.message).toEqual('Activation code sent to your email');
    });

    it('should throw error if token is used', async () => {
      const tokenClone = { ...singleToken };
      tokenClone.isUsed = true;
      prisma.activationCode.findFirst = jest.fn().mockResolvedValue(tokenClone);
      await expect(service.sendActivationEmail(singleUser)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  it('should resend activation email', async () => {
    service.sendActivationEmail = jest.fn().mockResolvedValue({
      message: 'Activation code sent to your email',
    });
    const message = await service.resendActivationEmail('awsd@asd.com');
    expect(message.message).toEqual('Activation code sent to your email');
  });

  it('should throw error if user is not exist', async () => {
    prisma.user.findFirst = jest.fn().mockResolvedValue(null);
    await expect(service.resendActivationEmail('asd')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return false if user is not activated', async () => {
    const result = await service.isUserActivated(1);
    expect(result).toBeFalsy();
  });

  it('should return true if user is activated', async () => {
    const tokenClone = { ...singleToken };
    tokenClone.isUsed = true;
    prisma.activationCode.findMany = jest.fn().mockResolvedValue([tokenClone]);
    const result = await service.isUserActivated(1);
    expect(result).toBeTruthy();
  });
});
