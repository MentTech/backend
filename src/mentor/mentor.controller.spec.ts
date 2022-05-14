import { Test, TestingModule } from '@nestjs/testing';
import { MentorController } from './mentor.controller';
import { MentorService } from './mentor.service';
import { SessionStatisticService } from './session-statistic.service';

const mockSessionStatisticService = {};

describe('MentorController', () => {
  let controller: MentorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MentorController],
      providers: [
        {
          provide: MentorService,
          useValue: {},
        },
        {
          provide: SessionStatisticService,
          useValue: mockSessionStatisticService,
        },
      ],
    }).compile();

    controller = module.get<MentorController>(MentorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
