import { Test, TestingModule } from '@nestjs/testing';
import { RatingService } from './rating.service';
import { PrismaService } from '../prisma/prisma.service';

const ratings = [
  {
    id: 1,
    registerId: 1,
    rating: 5,
    comment: '',
    createdAt: '2020-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    registerId: 2,
    rating: 4,
    comment: '',
    createdAt: '2020-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    registerId: 3,
    rating: 3,
    comment: '',
    createdAt: '2020-01-01T00:00:00.000Z',
  },
  {
    id: 4,
    registerId: 4,
    rating: 2,
    comment: '',
    createdAt: '2020-01-01T00:00:00.000Z',
  },
  {
    id: 5,
    registerId: 5,
    rating: 1,
    comment: '',
    createdAt: '2020-01-01T00:00:00.000Z',
  },
];

const mockPrismaService = {
  rating: {
    count: jest.fn().mockResolvedValue(1),
  },
};

describe('RatingService', () => {
  let service: RatingService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RatingService>(RatingService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
