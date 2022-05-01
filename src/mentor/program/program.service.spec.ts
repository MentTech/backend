import { Test, TestingModule } from '@nestjs/testing';
import { ProgramService } from './program.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RatingService } from '../../rating/rating.service';

const singleProgram = {
  id: 1,
  title: 'Program 1',
  detail: 'Program 1 description',
  credit: 100,
};

const singleMentor = {
  id: 1,
  name: 'Mentor 1',
  email: 'email@email.com',
  program: [singleProgram],
};

const mockPrismaService = {
  userMentor: {
    update: jest.fn().mockResolvedValue(singleMentor),
  },
  program: {
    create: jest.fn().mockResolvedValue(singleProgram),
    findFirst: jest.fn().mockResolvedValue(singleProgram),
    findMany: jest.fn().mockResolvedValue([singleProgram]),
    update: jest.fn().mockResolvedValue(singleProgram),
    delete: jest.fn().mockResolvedValue(singleProgram),
  },
};

const mockRatingService = {};

describe('ProgramService', () => {
  let service: ProgramService;
  let prisma: PrismaService;
  let ratingService: RatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgramService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: RatingService,
          useValue: mockRatingService,
        },
      ],
    }).compile();

    service = module.get<ProgramService>(ProgramService);
    prisma = module.get<PrismaService>(PrismaService);
    ratingService = module.get<RatingService>(RatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new program of a mentor', async () => {
    const program = {
      title: 'Program 1',
      detail: 'Program 1 description',
      credit: 100,
    };
    const result = await service.create(program, 1);
    expect(result).toEqual(singleProgram);
  });

  it('should return all programs of a mentor', async () => {
    const result = await service.findAll(1);
    expect(result).toEqual([singleProgram]);
  });

  it('should update a program of a mentor', async () => {
    const program = {
      id: 1,
      title: 'Program 1',
      detail: 'Program 1 description',
      credit: 100,
    };
    const result = await service.update(1, program, 1);
    expect(result).toEqual(singleProgram);
  });

  it('should delete a program of a mentor', async () => {
    const result = await service.remove(1, 1);
    expect(result).toEqual(singleProgram);
  });
});
