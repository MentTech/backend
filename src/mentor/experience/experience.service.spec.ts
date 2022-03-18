import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { ExperienceService } from './experience.service';

const singleExperience = {
  id: 1,
  title: 'Experience',
  description: 'Description',
  company: 'Company',
  startAt: new Date(),
};

const mockPrismaService = {
  userMentor: {
    update: jest.fn().mockResolvedValue({ experiences: singleExperience }),
  },
  experience: {
    findMany: jest.fn().mockResolvedValue([singleExperience]),
    findFirst: jest.fn().mockResolvedValue(singleExperience),
    update: jest.fn().mockResolvedValue(singleExperience),
    delete: jest.fn().mockResolvedValue(singleExperience),
  },
};

describe('ExperienceService', () => {
  let service: ExperienceService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExperienceService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ExperienceService>(ExperienceService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new experience', async () => {
    const createExperienceDto = {
      title: 'Experience',
      description: 'Description',
      company: 'Company',
      startAt: '2020-01-01',
    };
    const mentorId = 1;
    const result = await service.create(createExperienceDto, mentorId);
    expect(result).toEqual({ experiences: singleExperience });
  });

  it('should find all experiences of a mentor', async () => {
    const mentorId = 1;
    const result = await service.findAll(mentorId);
    expect(result).toEqual([singleExperience]);
  });

  it('should find one experience of a mentor', async () => {
    const id = 1;
    const mentorId = 1;
    const result = await service.findOne(id, mentorId);
    expect(result).toEqual(singleExperience);
  });

  it('should update experience', async () => {
    const id = 1;
    const updateExperienceDto = {
      title: 'Experience',
      description: 'Description',
      company: 'Company',
      startAt: '2020-01-01',
    };
    const mentorId = 1;
    const result = await service.update(id, updateExperienceDto, mentorId);
    expect(result).toEqual(singleExperience);
  });

  it('should remove experience', async () => {
    const id = 1;
    const mentorId = 1;
    const result = await service.remove(id, mentorId);
    expect(result).toEqual(singleExperience);
  });
});
