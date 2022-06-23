import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { Notification } from '@prisma/client';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

const notifications: Partial<Notification>[] = [
  {
    id: 1,
    typeId: 1,
    actorId: 1,
    notifierId: 3,
    message: 'test',
    isRead: false,
  },
  {
    id: 2,
    typeId: 1,
    actorId: 1,
    notifierId: 2,
    message: 'test',
    isRead: false,
  },
  {
    id: 3,
    typeId: 1,
    actorId: 1,
    notifierId: 2,
    message: 'test',
    isRead: false,
  },
];

const mockPrismaService = {
  notification: {
    findMany: jest.fn().mockResolvedValue(notifications),
    findFirst: jest.fn().mockResolvedValue(notifications[0]),
    update: jest.fn().mockResolvedValue(notifications[0]),
  },
};

describe('NotificationService', () => {
  let service: NotificationService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should return user's notifications", async () => {
    const result = await service.getNotification(1, 10, 0);
    expect(result).toEqual(notifications);
  });

  it('should set notification as read', async () => {
    const result = await service.setNotificationRead(1, 3);
    expect(result).toEqual(notifications[0]);
  });

  it("should throw error if notification is not user's", async () => {
    await expect(service.setNotificationRead(1, 2)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should throw error if notification is not found', async () => {
    jest.spyOn(prisma.notification, 'findFirst').mockResolvedValue(null);
    await expect(service.setNotificationRead(1, 4)).rejects.toThrow(
      NotFoundException,
    );
  });
});
