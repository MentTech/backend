import { Test, TestingModule } from '@nestjs/testing';
import { StatisticAdminService } from './statistic-admin.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {};

describe('StatisticAdminService', () => {
  let service: StatisticAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticAdminService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<StatisticAdminService>(StatisticAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
