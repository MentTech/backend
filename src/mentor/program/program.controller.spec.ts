import { Test, TestingModule } from '@nestjs/testing';
import { ProgramController } from './program.controller';
import { ProgramService } from './program.service';

const mockProgramService = {};

describe('ProgramController', () => {
  let controller: ProgramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgramController],
      providers: [
        {
          provide: ProgramService,
          useValue: mockProgramService,
        },
      ],
    }).compile();

    controller = module.get<ProgramController>(ProgramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
