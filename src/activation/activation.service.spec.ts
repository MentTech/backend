import { Test, TestingModule } from '@nestjs/testing';
import { ActivationService } from './activation.service';
import { PrismaService } from '../prisma/prisma.service';

let mockPrismaService = {};

describe('ActivationService', () => {
  let service: ActivationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ActivationService>(ActivationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
