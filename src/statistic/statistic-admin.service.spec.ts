import { Test, TestingModule } from '@nestjs/testing';
import { StatisticAdminService } from './statistic-admin.service';

describe('StatisticAdminService', () => {
  let service: StatisticAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatisticAdminService],
    }).compile();

    service = module.get<StatisticAdminService>(StatisticAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
