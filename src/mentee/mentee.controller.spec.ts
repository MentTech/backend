import { Test, TestingModule } from '@nestjs/testing';
import { MenteeController } from './mentee.controller';
import { MenteeService } from './mentee.service';

let mockMenteeService = {};

describe('MenteeController', () => {
  let controller: MenteeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenteeController],
      providers: [
        {
          provide: MenteeService,
          useValue: mockMenteeService,
        },
      ],
    }).compile();

    controller = module.get<MenteeController>(MenteeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
