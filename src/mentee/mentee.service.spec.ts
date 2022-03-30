import { Test, TestingModule } from '@nestjs/testing';
import { MenteeService } from './mentee.service';

describe('MenteeService', () => {
  let service: MenteeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenteeService],
    }).compile();

    service = module.get<MenteeService>(MenteeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
