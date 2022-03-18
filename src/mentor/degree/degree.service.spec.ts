import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { DegreeService } from './degree.service';

const singleDegree = {
  id: 1,
  title: 'Degree',
  description: 'Description',
  issuer: 'Issuer',
  startAt: new Date(),
  createAt: new Date(),
};

const mentor = {
  id: 1,
  name: 'Mentor',
  degree: [singleDegree],
};

const multipleDegrees = [singleDegree];

const mockPrismaService = {
  userMentor: {
    update: jest.fn().mockResolvedValue(mentor),
  },
  degree: {
    findMany: jest.fn().mockResolvedValue(multipleDegrees),
    findFirst: jest.fn().mockResolvedValue(singleDegree),
    update: jest.fn().mockResolvedValue(singleDegree),
    delete: jest.fn().mockResolvedValue(singleDegree),
  },
};

describe('DegreeService', () => {
  let service: DegreeService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DegreeService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<DegreeService>(DegreeService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new degree', async () => {
    const createDegreeDto = {
      title: 'Degree',
      description: 'Description',
      issuer: 'Issuer',
      startAt: '2020-01-01',
    };
    const mentorId = 1;

    const result = await service.create(createDegreeDto, mentorId);

    expect(prisma.userMentor.update).toBeCalledWith({
      where: { userId: mentorId },
      data: {
        degree: {
          create: createDegreeDto,
        },
      },
      select: {
        degree: true,
      },
    });
    expect(result).toEqual(mentor);
  });

  it('should return all degree from a mentor', async () => {
    const mentorId = 1;

    const result = await service.findAll(mentorId);

    expect(prisma.degree.findMany).toBeCalledWith({
      where: {
        mentorId,
      },
    });
    expect(result).toEqual(multipleDegrees);
  });

  it('should return single degree from a mentor', async () => {
    const id = 1;
    const mentorId = 1;

    const result = await service.findOne(id, mentorId);

    expect(prisma.degree.findFirst).toBeCalledWith({
      where: {
        mentorId,
        id,
      },
    });
    expect(result).toEqual(singleDegree);
  });

  it('should update a degree', async () => {
    const id = 1;
    const updateDegreeDto = {
      title: 'Degree',
      description: 'Description',
      issuer: 'Issuer',
      startAt: '2020-01-01',
    };
    const mentorId = 1;

    const result = await service.update(id, updateDegreeDto, mentorId);

    expect(prisma.degree.update).toBeCalledWith({
      where: {
        id,
      },
      data: updateDegreeDto,
    });
    expect(result).toEqual(singleDegree);
  });

  it('should delete a degree', async () => {
    const id = 1;
    const mentorId = 1;

    const result = await service.remove(id, mentorId);

    expect(prisma.degree.delete).toBeCalledWith({
      where: {
        id,
      },
    });
    expect(result).toEqual(singleDegree);
  });
});
