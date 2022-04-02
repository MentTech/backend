import { Test, TestingModule } from '@nestjs/testing';
import { MenteeService } from './mentee.service';
import { PrismaService } from '../prisma/prisma.service';

let mockPrismaSerivce = {};

describe('MenteeService', () => {
  let service: MenteeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenteeService,
        {
          provide: PrismaService,
          useValue: mockPrismaSerivce,
        },
      ],
    }).compile();

    service = module.get<MenteeService>(MenteeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
