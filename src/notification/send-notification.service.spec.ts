import { Test, TestingModule } from '@nestjs/testing';
import { SendNotificationService } from './send-notification.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {};

describe('SendNotificationService', () => {
  let service: SendNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendNotificationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SendNotificationService>(SendNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
