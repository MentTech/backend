import { Test, TestingModule } from '@nestjs/testing';
import { MenteeController } from './mentee.controller';
import { MenteeService } from './mentee.service';

describe('MenteeController', () => {
  let controller: MenteeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenteeController],
      providers: [MenteeService],
    }).compile();

    controller = module.get<MenteeController>(MenteeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
